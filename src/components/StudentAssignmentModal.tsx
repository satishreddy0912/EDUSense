import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Trophy,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Check,
  Award,
  BarChart2,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/* =========================================================
   TYPES
========================================================= */

export type QuestionType = 'MCQ' | 'True/False' | 'Short Answer' | 'Math Calculation' | 'Worksheet';

export interface AssignmentQuestion {
  id: string | number;
  type: string;
  text: string;
  options?: string[];
  answer: string;
  hint?: string;
  solution?: string;
  marks: number;
  source?: string;
}

export interface StudentAssignment {
  id: string;
  title: string;
  subject: string;
  topic: string;
  className?: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  type: 'Quiz' | 'Worksheet' | 'Homework' | 'Activity' | 'Assessment';
  totalMarks: number;
  durationMinutes?: number;
  questions: AssignmentQuestion[];
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  percentage?: number;
  grade?: string;
  submittedAt?: string;
  feedback?: string;
  studentAnswers?: Record<string | number, string>;
  questionResults?: QuestionResult[];
}

export interface QuestionResult {
  questionId: string | number;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  feedback: string;
  explanation?: string;
}

export interface SubmissionData {
  assignmentId: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  timeSpentSeconds: number;
  studentAnswers: Record<string | number, string>;
  questionResults: QuestionResult[];
  feedback: string;
}

interface StudentAssignmentModalProps {
  assignment: StudentAssignment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitAssignment: (submission: SubmissionData) => void;
  initialMode?: 'answering' | 'review';
}

/* =========================================================
   HELPER FUNCTIONS FOR OPTIONS & GRADING
========================================================= */

// Generate plausible MCQ options if none were supplied
function ensureOptions(q: AssignmentQuestion): string[] {
  if (q.options && q.options.length >= 2) {
    return q.options;
  }

  const rawAns = (q.answer || '').trim();
  const lowerAns = rawAns.toLowerCase();

  // If question is True/False
  if (q.type.toLowerCase().includes('true') || q.type.toLowerCase().includes('false') || lowerAns === 'true' || lowerAns === 'false') {
    return ['True', 'False'];
  }

  // Fraction math answers (e.g. "3/4" or "7/10")
  if (rawAns.includes('/')) {
    const parts = rawAns.split('/').map((p) => parseInt(p.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [n, d] = parts;
      const opt1 = rawAns;
      const opt2 = `${Math.max(1, n - 1)}/${d}`;
      const opt3 = `${n + 1}/${d}`;
      const opt4 = `${n}/${d + 2}`;
      const set = Array.from(new Set([opt1, opt2, opt3, opt4]));
      while (set.length < 4) set.push(`${set.length + 1}/${d}`);
      return set.sort(() => (q.id ? (Number(String(q.id).charCodeAt(0)) % 2 === 0 ? 1 : -1) : 0.5));
    }
  }

  // CS/General options generator
  if (lowerAns.includes('queue') || lowerAns.includes('fifo')) {
    return ['Queue (FIFO)', 'Stack (LIFO)', 'Binary Tree', 'Linked List'];
  }
  if (lowerAns.includes('stack') || lowerAns.includes('lifo')) {
    return ['Stack (LIFO)', 'Queue (FIFO)', 'Graph', 'Hash Map'];
  }
  if (lowerAns.includes('o(log n)') || lowerAns.includes('log n')) {
    return ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'];
  }
  if (lowerAns.includes('dequeue')) {
    return ['Dequeue', 'Enqueue', 'Push', 'Pop'];
  }
  if (lowerAns.includes('chloroplast') || lowerAns.includes('photosynthesis')) {
    return ['Chloroplast', 'Mitochondria', 'Nucleus', 'Cell Wall'];
  }

  // Default fallback options containing the answer
  const baseOptions = [
    rawAns,
    `Option B (${rawAns.length > 5 ? rawAns.substring(0, 5) + '...' : 'Alternate'})`,
    'None of the above',
    'Both A and B',
  ];
  return Array.from(new Set(baseOptions));
}

// Clean and normalize strings for matching
function normalizeText(text: string): string {
  return (text || '')
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ');
}

// Evaluate answer correctness and assign score
function evaluateAnswer(q: AssignmentQuestion, studentAnswer: string): QuestionResult {
  const maxScore = Number(q.marks) || 1;
  const sAns = (studentAnswer || '').trim();
  const cAns = (q.answer || '').trim();

  if (!sAns) {
    return {
      questionId: q.id,
      studentAnswer: 'No answer provided',
      correctAnswer: cAns,
      isCorrect: false,
      score: 0,
      maxScore,
      feedback: 'Question was left unanswered.',
      explanation: q.solution || q.hint || `The expected answer is: ${cAns}`,
    };
  }

  const sNorm = normalizeText(sAns);
  const cNorm = normalizeText(cAns);

  // Exact or normalized match
  if (sNorm === cNorm || sAns.toLowerCase() === cAns.toLowerCase()) {
    return {
      questionId: q.id,
      studentAnswer: sAns,
      correctAnswer: cAns,
      isCorrect: true,
      score: maxScore,
      maxScore,
      feedback: 'Correct! Excellent understanding.',
      explanation: q.solution || q.hint || `Well done! Correct answer: ${cAns}`,
    };
  }

  // Check if student answer contains core keywords from correct answer or vice versa
  const cWords = cNorm.split(' ').filter((w) => w.length > 2);
  const matchedWords = cWords.filter((w) => sNorm.includes(w));
  const matchRatio = cWords.length > 0 ? matchedWords.length / cWords.length : 0;

  if (matchRatio >= 0.7) {
    return {
      questionId: q.id,
      studentAnswer: sAns,
      correctAnswer: cAns,
      isCorrect: true,
      score: maxScore,
      maxScore,
      feedback: 'Correct! Key concepts accurately explained.',
      explanation: q.solution || q.hint || `Answer contains the expected concepts: ${cAns}`,
    };
  } else if (matchRatio >= 0.4) {
    const partialScore = Math.max(0.5, Math.round(maxScore * 0.5 * 10) / 10);
    return {
      questionId: q.id,
      studentAnswer: sAns,
      correctAnswer: cAns,
      isCorrect: false,
      score: partialScore,
      maxScore,
      feedback: `Partially correct (${partialScore}/${maxScore} marks). Some key points were captured.`,
      explanation: q.solution || q.hint || `Expected complete answer: ${cAns}`,
    };
  }

  return {
    questionId: q.id,
    studentAnswer: sAns,
    correctAnswer: cAns,
    isCorrect: false,
    score: 0,
    maxScore,
    feedback: 'Incorrect. Review the solution steps below to understand.',
    explanation: q.solution || q.hint || `The correct answer is: ${cAns}`,
  };
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'D';
}

function generateFeedbackSummary(percentage: number, subject: string, topic: string): string {
  if (percentage >= 90) {
    return `Outstanding mastery in ${subject} (${topic})! You demonstrated exceptional clarity on all core concepts.`;
  }
  if (percentage >= 75) {
    return `Great performance in ${subject}! A quick review of missed questions will help you reach full mastery.`;
  }
  if (percentage >= 50) {
    return `Good effort on ${topic}. We recommend reviewing the teacher video explanations and practice exercises.`;
  }
  return `Keep practicing ${subject}! Re-watch the teacher's lesson explanation and try retaking this assignment to improve retention.`;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function StudentAssignmentModal({
  assignment,
  isOpen,
  onClose,
  onSubmitAssignment,
  initialMode = 'answering',
}: StudentAssignmentModalProps) {
  const [mode, setMode] = useState<'answering' | 'results' | 'review'>('answering');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string | number, string>>({});
  const [flagged, setFlagged] = useState<Set<string | number>>(new Set());
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionData | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (!isOpen || !assignment) return;

    if (initialMode === 'review' || assignment.status === 'submitted' || assignment.status === 'graded') {
      // Setup review mode with saved answers and results
      setMode('review');
      setAnswers(assignment.studentAnswers || {});
      if (assignment.score !== undefined && assignment.percentage !== undefined) {
        setSubmissionResult({
          assignmentId: assignment.id,
          submittedAt: assignment.submittedAt || new Date().toISOString(),
          score: assignment.score,
          totalMarks: assignment.totalMarks,
          percentage: assignment.percentage,
          grade: assignment.grade || calculateGrade(assignment.percentage),
          timeSpentSeconds: 180,
          studentAnswers: assignment.studentAnswers || {},
          questionResults: assignment.questionResults || assignment.questions.map((q) => evaluateAnswer(q, assignment.studentAnswers?.[q.id] || '')),
          feedback: assignment.feedback || generateFeedbackSummary(assignment.percentage, assignment.subject, assignment.topic),
        });
      }
    } else {
      // Fresh test answering mode
      setMode('answering');
      setCurrentIndex(0);
      setAnswers({});
      setFlagged(new Set());
      setTimeSpentSeconds(0);
      setShowHint(false);
      setSubmissionResult(null);
    }
  }, [isOpen, assignment, initialMode]);

  // Stopwatch timer for test taking
  useEffect(() => {
    if (isOpen && mode === 'answering') {
      timerRef.current = setInterval(() => {
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, mode]);

  if (!isOpen || !assignment) return null;

  const questions = assignment.questions || [];
  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).filter((k) => (answers[k] || '').trim() !== '').length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Format time display (MM:SS)
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  // Answer selection handler
  const handleSelectAnswer = (qId: string | number, answerValue: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: answerValue,
    }));
  };

  // Flag toggle handler
  const toggleFlag = (qId: string | number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Submit test and evaluate
  const executeSubmission = () => {
    setShowSubmitConfirm(false);

    let totalScore = 0;
    const questionResults: QuestionResult[] = [];

    questions.forEach((q) => {
      const studentAns = answers[q.id] || '';
      const evalResult = evaluateAnswer(q, studentAns);
      totalScore += evalResult.score;
      questionResults.push(evalResult);
    });

    const maxTotal = assignment.totalMarks || questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
    const percentage = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 100;
    const grade = calculateGrade(percentage);
    const feedback = generateFeedbackSummary(percentage, assignment.subject, assignment.topic);

    const submission: SubmissionData = {
      assignmentId: assignment.id,
      submittedAt: new Date().toISOString(),
      score: Math.round(totalScore * 10) / 10,
      totalMarks: maxTotal,
      percentage,
      grade,
      timeSpentSeconds,
      studentAnswers: answers,
      questionResults,
      feedback,
    };

    setSubmissionResult(submission);
    setMode('results');
    onSubmitAssignment(submission);
    toast.success(`Assignment submitted! Score: ${submission.score}/${submission.totalMarks} (${percentage}%)`);
  };

  const handleRetake = () => {
    setMode('answering');
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeSpentSeconds(0);
    setShowHint(false);
    setSubmissionResult(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-2 sm:p-4 md:p-6 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card text-foreground shadow-2xl"
        >
          {/* ===================================================
              TOP HEADER BAR
          =================================================== */}
          <div className="flex flex-wrap items-center justify-between border-b border-border/80 bg-muted/20 px-5 py-3.5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">{assignment.title}</h2>
                  <Badge variant="outline" className="border-border text-xs">
                    {assignment.subject}
                  </Badge>
                  {mode === 'answering' ? (
                    <Badge className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px]">
                      Live Answering
                    </Badge>
                  ) : (
                    <Badge className="bg-primary/15 text-primary border border-primary/30 text-[11px]">
                      Results & Solutions
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Teacher: <span className="text-foreground font-medium">{assignment.teacherName}</span> • Topic:{' '}
                  <span className="text-foreground">{assignment.topic}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              {mode === 'answering' && (
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-1 text-xs font-mono text-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{formatTime(timeSpentSeconds)}</span>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ===================================================
              PROGRESS BAR (When Answering)
          =================================================== */}
          {mode === 'answering' && (
            <div className="border-b border-border/40 bg-card/40 px-6 py-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                <span>
                  Question <strong className="text-cyan-400">{currentIndex + 1}</strong> of {totalQuestions}
                </span>
                <span>
                  Answered: <strong className="text-emerald-400">{answeredCount}</strong> / {totalQuestions} ({progressPercent}%)
                </span>
              </div>
              <Progress value={progressPercent} className="h-1.5 bg-muted/40" />
            </div>
          )}

          {/* ===================================================
              MAIN BODY
          =================================================== */}
          <div className="flex flex-1 overflow-hidden">
            {mode === 'results' ? (
              /* ===================================================
                 SCREEN 1: INSTANT RESULTS & SCORECARD
              =================================================== */
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                {submissionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-3xl space-y-6"
                  >
                    {/* Scorecard Hero Card */}
                    <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 text-center shadow-sm">
                      <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Trophy className="h-7 w-7" />
                      </div>

                      <Badge className="mb-2 bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs px-3 py-0.5">
                        Assignment Completed
                      </Badge>

                      <h2 className="text-2xl font-bold text-foreground tracking-tight">
                        Great Effort, Aarav!
                      </h2>
                      <p className="mt-1.5 text-sm text-muted-foreground max-w-xl mx-auto">{submissionResult.feedback}</p>

                      {/* Key Score Metrics Grid */}
                      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5">
                          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Score</p>
                          <p className="text-xl font-bold text-primary mt-1">
                            {submissionResult.score} / {submissionResult.totalMarks}
                          </p>
                        </div>

                        <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5">
                          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Accuracy</p>
                          <p className="text-xl font-bold text-emerald-500 mt-1">{submissionResult.percentage}%</p>
                        </div>

                        <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5">
                          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Grade</p>
                          <p className="text-xl font-bold text-purple-400 mt-1">{submissionResult.grade}</p>
                        </div>

                        <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5">
                          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Time</p>
                          <p className="text-xl font-bold text-amber-500 mt-1">{formatTime(submissionResult.timeSpentSeconds)}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <Button
                          onClick={() => setMode('review')}
                          className="bg-gradient-to-r from-cyan-400 via-sky-300 to-pink-400 text-slate-950 font-bold px-6 shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:shadow-[0_0_30px_rgba(0,210,255,0.55)] transition-all"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Detailed Solutions
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleRetake}
                          className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Retake Assignment
                        </Button>
                        <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-white">
                          Done
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : mode === 'review' ? (
              /* ===================================================
                 SCREEN 2: QUESTION-BY-QUESTION SOLUTION REVIEW
              =================================================== */
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Questions Palette Sidebar */}
                <div className="w-full md:w-64 shrink-0 border-r border-border/40 bg-card/30 p-4 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Review Palette</p>
                    <Badge variant="outline" className="text-[10px]">
                      {submissionResult?.score} / {submissionResult?.totalMarks} pts
                    </Badge>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                      const res = submissionResult?.questionResults.find((r) => r.questionId === q.id);
                      const isCorrect = res?.isCorrect;
                      const isPartial = res && res.score > 0 && !res.isCorrect;

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          className={cn(
                            'flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition-all',
                            currentIndex === idx ? 'ring-2 ring-cyan-400 scale-105 shadow-md' : '',
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isPartial
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          )}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 space-y-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
                      <span>Correct Answer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/40 border border-red-500" />
                      <span>Incorrect / Needs Review</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetake}
                      className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs"
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                      Retake for Practice
                    </Button>
                  </div>
                </div>

                {/* Review Question Content */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto p-5 sm:p-7">
                  {currentQuestion && (
                    <div className="space-y-5 max-w-3xl">
                      {/* Question Top Tags */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                            Q{currentIndex + 1}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {currentQuestion.type || 'Question'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {currentQuestion.marks} Marks
                          </Badge>
                        </div>

                        {(() => {
                          const res = submissionResult?.questionResults.find((r) => r.questionId === currentQuestion.id);
                          return res?.isCorrect ? (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 gap-1">
                              <Check className="h-3 w-3" /> Correct (+{res.score}/{res.maxScore})
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/20 text-red-300 border-red-500/40 gap-1">
                              <X className="h-3 w-3" /> Incorrect ({res?.score || 0}/{res?.maxScore || currentQuestion.marks})
                            </Badge>
                          );
                        })()}
                      </div>

                      {/* Question Statement */}
                      <Card className="border-cyan-500/20 bg-card/60 p-5">
                        <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                          {currentQuestion.text}
                        </p>
                      </Card>

                      {/* Student's Answer vs Correct Answer */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Your Answer:
                          </p>
                          <p className="font-semibold text-foreground break-words">
                            {answers[currentQuestion.id] || <span className="text-muted-foreground italic">No answer</span>}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                            Correct Answer:
                          </p>
                          <p className="font-semibold text-emerald-300 break-words">{currentQuestion.answer}</p>
                        </div>
                      </div>

                      {/* Step-by-Step Solution / AI Learning Notes */}
                      {(currentQuestion.solution || currentQuestion.hint) && (
                        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4">
                          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm mb-2">
                            <Lightbulb className="h-4 w-4" />
                            <span>Step-by-Step Solution & Concept Notes</span>
                          </div>
                          <p className="text-sm text-cyan-100/90 leading-relaxed">
                            {currentQuestion.solution || currentQuestion.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Navigation Footer */}
                  <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      className="border-border/60"
                    >
                      <ChevronLeft className="mr-1.5 h-4 w-4" /> Previous
                    </Button>

                    <span className="text-xs text-muted-foreground font-mono">
                      {currentIndex + 1} of {totalQuestions}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentIndex === totalQuestions - 1}
                      onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="border-border/60"
                    >
                      Next <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* ===================================================
                 SCREEN 3: LIVE TEST ANSWERING EXPERIENCE
              =================================================== */
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Questions Palette Sidebar */}
                <div className="w-full md:w-64 shrink-0 border-r border-cyan-500/20 bg-card/30 p-4 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question Map</p>
                    <Badge variant="outline" className="text-[10px] text-cyan-400">
                      {answeredCount}/{totalQuestions} Done
                    </Badge>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                      const isAnswered = Boolean((answers[q.id] || '').trim());
                      const isFlagged = flagged.has(q.id);
                      const isCurrent = currentIndex === idx;

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            setCurrentIndex(idx);
                            setShowHint(false);
                          }}
                          className={cn(
                            'relative flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition-all',
                            isCurrent ? 'ring-2 ring-cyan-400 scale-105 shadow-md' : '',
                            isFlagged
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                              : isAnswered
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-muted/20 text-muted-foreground border border-border/40 hover:border-cyan-500/40'
                          )}
                        >
                          {idx + 1}
                          {isFlagged && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Palette Legend */}
                  <div className="mt-6 space-y-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
                      <span>Answered ({answeredCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500/40 border border-amber-500" />
                      <span>Flagged for Review ({flagged.size})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted/30 border border-border" />
                      <span>Unanswered ({totalQuestions - answeredCount})</span>
                    </div>
                  </div>

                  {/* Quick Finish Button on Sidebar */}
                  <div className="mt-6 pt-4 border-t border-border/40">
                    <Button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Submit Assignment
                    </Button>
                  </div>
                </div>

                {/* Question Interactive Workspace */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto p-5 sm:p-7">
                  {currentQuestion && (
                    <div className="space-y-5 max-w-3xl">
                      {/* Header tags */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-sm">
                            {currentIndex + 1}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {currentQuestion.type || 'Question'}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-300">
                            {currentQuestion.marks} Marks
                          </Badge>
                          {currentQuestion.source && (
                            <Badge variant="outline" className="text-[11px] text-muted-foreground">
                              Source: {currentQuestion.source}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFlag(currentQuestion.id)}
                            className={cn(
                              'h-8 gap-1.5 text-xs font-medium rounded-xl',
                              flagged.has(currentQuestion.id)
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <Flag className="h-3.5 w-3.5" />
                            {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag for review'}
                          </Button>

                          {currentQuestion.hint && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowHint(!showHint)}
                              className="h-8 gap-1 text-xs text-cyan-400 hover:bg-cyan-500/10"
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                              {showHint ? 'Hide Hint' : 'Hint'}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Question Prompt */}
                      <div className="rounded-2xl border border-cyan-500/30 bg-card/60 p-5 shadow-[0_0_20px_rgba(0,210,255,0.05)]">
                        <p className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                          {currentQuestion.text}
                        </p>

                        {showHint && currentQuestion.hint && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-200"
                          >
                            💡 <strong>Teacher Hint:</strong> {currentQuestion.hint}
                          </motion.div>
                        )}
                      </div>

                      {/* Answering Controls by Question Type */}
                      <div className="space-y-3 pt-2">
                        {currentQuestion.type.toLowerCase().includes('true') ||
                        currentQuestion.type.toLowerCase().includes('false') ? (
                          /* True / False Choice Options */
                          <div className="grid grid-cols-2 gap-4">
                            {['True', 'False'].map((option) => {
                              const isSelected = answers[currentQuestion.id] === option;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleSelectAnswer(currentQuestion.id, option)}
                                  className={cn(
                                    'flex flex-col items-center justify-center gap-2 rounded-2xl border p-6 text-center transition-all',
                                    isSelected
                                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(0,210,255,0.3)] scale-[1.02]'
                                      : 'border-border/60 bg-card/40 text-muted-foreground hover:border-cyan-500/40 hover:bg-card/80'
                                  )}
                                >
                                  {option === 'True' ? (
                                    <CheckCircle2
                                      className={cn('h-8 w-8', isSelected ? 'text-emerald-400' : 'text-muted-foreground')}
                                    />
                                  ) : (
                                    <AlertCircle
                                      className={cn('h-8 w-8', isSelected ? 'text-rose-400' : 'text-muted-foreground')}
                                    />
                                  )}
                                  <span className="text-lg font-bold">{option}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : currentQuestion.type.toUpperCase() === 'MCQ' ||
                          (currentQuestion.options && currentQuestion.options.length > 0) ? (
                          /* Multiple Choice Options */
                          <div className="space-y-2.5">
                            {ensureOptions(currentQuestion).map((option, idx) => {
                              const optionLetter = String.fromCharCode(65 + idx);
                              const isSelected = answers[currentQuestion.id] === option;

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleSelectAnswer(currentQuestion.id, option)}
                                  className={cn(
                                    'group flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all',
                                    isSelected
                                      ? 'border-cyan-400 bg-cyan-500/15 text-white shadow-[0_0_20px_rgba(0,210,255,0.25)]'
                                      : 'border-border/60 bg-card/40 text-foreground hover:border-cyan-500/40 hover:bg-card/80'
                                  )}
                                >
                                  <div
                                    className={cn(
                                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all',
                                      isSelected
                                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,210,255,0.5)]'
                                        : 'bg-muted/40 text-muted-foreground group-hover:text-cyan-300'
                                    )}
                                  >
                                    {optionLetter}
                                  </div>
                                  <span className="text-sm sm:text-base font-medium flex-1">{option}</span>
                                  {isSelected && <Check className="h-5 w-5 text-cyan-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          /* Short Answer / Text / Calculation */
                          <div className="space-y-2">
                            <label className="text-xs text-muted-foreground font-medium">
                              Type your answer / calculations below:
                            </label>
                            <textarea
                              rows={4}
                              value={answers[currentQuestion.id] || ''}
                              onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                              placeholder="Type your final answer and working steps here..."
                              className="w-full rounded-2xl border border-border/70 bg-card/60 p-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/50 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                            />
                            <p className="text-right text-[11px] text-muted-foreground">
                              {(answers[currentQuestion.id] || '').length} characters entered
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons Footer */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentIndex === 0}
                      onClick={() => {
                        setCurrentIndex((prev) => Math.max(0, prev - 1));
                        setShowHint(false);
                      }}
                      className="border-border/60"
                    >
                      <ChevronLeft className="mr-1.5 h-4 w-4" /> Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {currentIndex < totalQuestions - 1 ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                            setShowHint(false);
                          }}
                          className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
                        >
                          Next Question <ChevronRight className="ml-1.5 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setShowSubmitConfirm(true)}
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        >
                          <Send className="mr-1.5 h-4 w-4" /> Submit All Answers
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              SUBMISSION CONFIRMATION MODAL
          =================================================== */}
          {showSubmitConfirm && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full rounded-3xl border border-cyan-500/40 bg-[#0d1330] p-6 shadow-2xl text-center space-y-4"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Send className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-bold text-white">Ready to Submit?</h3>

                <p className="text-sm text-muted-foreground">
                  You have answered <strong className="text-emerald-400">{answeredCount}</strong> out of{' '}
                  <strong className="text-white">{totalQuestions}</strong> questions.
                  {totalQuestions - answeredCount > 0 && (
                    <span className="block mt-1 text-amber-300 font-medium">
                      ⚠️ You have {totalQuestions - answeredCount} unanswered question(s).
                    </span>
                  )}
                </p>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="flex-1 border-border/60"
                  >
                    Keep Answering
                  </Button>
                  <Button
                    onClick={executeSubmission}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 hover:brightness-110"
                  >
                    Confirm & Submit
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
