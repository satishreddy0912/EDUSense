import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  BookOpen,
  UsersRound,
  Printer,
  Share2,
  Check,
  X,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Download,
  Clock,
  Award,
  Pizza,
  CheckCircle2,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n';

/* =========================================================
   TYPES & DATA
========================================================= */

export type RecommendationType = 'worksheet' | 'homework' | 'group' | null;

interface TeacherRecommendationsModalProps {
  type: RecommendationType;
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (type: string, title: string) => void;
}

const WORKSHEET_PROBLEMS = [
  { id: 1, type: 'Like Denominators', q: '1/4 + 2/4 = ?', ans: '3/4', level: 'Easy' },
  { id: 2, type: 'Like Denominators', q: '2/5 + 1/5 = ?', ans: '3/5', level: 'Easy' },
  { id: 3, type: 'Like Denominators', q: '3/8 + 3/8 = ?', ans: '6/8 = 3/4', level: 'Easy' },
  { id: 4, type: 'Like Denominators', q: '5/12 + 1/12 = ?', ans: '6/12 = 1/2', level: 'Easy' },
  { id: 5, type: 'Like Denominators', q: '4/10 + 3/10 = ?', ans: '7/10', level: 'Easy' },
  { id: 6, type: 'Like Denominators', q: '2/6 + 3/6 = ?', ans: '5/6', level: 'Easy' },
  { id: 7, type: 'Unlike Denominators', q: '1/2 + 1/4 = ?', ans: '2/4 + 1/4 = 3/4', level: 'Medium' },
  { id: 8, type: 'Unlike Denominators', q: '1/3 + 1/6 = ?', ans: '2/6 + 1/6 = 3/6 = 1/2', level: 'Medium' },
  { id: 9, type: 'Unlike Denominators', q: '1/4 + 3/8 = ?', ans: '2/8 + 3/8 = 5/8', level: 'Medium' },
  { id: 10, type: 'Unlike Denominators', q: '2/5 + 3/10 = ?', ans: '4/10 + 3/10 = 7/10', level: 'Medium' },
  { id: 11, type: 'Unlike Denominators', q: '1/6 + 5/12 = ?', ans: '2/12 + 5/12 = 7/12', level: 'Medium' },
  { id: 12, type: 'Unlike Denominators', q: '1/2 + 1/3 = ?', ans: '3/6 + 2/6 = 5/6', level: 'Hard' },
  { id: 13, type: 'Unlike Denominators', q: '2/3 + 1/4 = ?', ans: '8/12 + 3/12 = 11/12', level: 'Hard' },
  { id: 14, type: 'Unlike Denominators', q: '3/4 + 1/6 = ?', ans: '9/12 + 2/12 = 11/12', level: 'Hard' },
  { id: 15, type: 'Word Problem', q: 'Ravi ate 1/4 of a watermelon and Sita ate 2/4. What fraction did they eat together?', ans: '1/4 + 2/4 = 3/4', level: 'Medium' },
  { id: 16, type: 'Word Problem', q: 'A tank is filled 1/3 with oil in morning and 1/6 in evening. Total fraction filled?', ans: '2/6 + 1/6 = 3/6 = 1/2 tank', level: 'Medium' },
  { id: 17, type: 'Word Problem', q: 'Priya painted 2/8 of a mural on Monday and 3/8 on Tuesday. How much is completed?', ans: '2/8 + 3/8 = 5/8 mural', level: 'Easy' },
  { id: 18, type: 'Word Problem', q: 'A farmer ploughed 1/2 of field on day 1 and 1/4 on day 2. How much is ploughed?', ans: '2/4 + 1/4 = 3/4 field', level: 'Medium' },
  { id: 19, type: 'Mixed Concept', q: 'Which is greater: 1/2 + 1/4 or 2/3 + 1/6?', ans: '1/2 + 1/4 = 3/4 (0.75), 2/3 + 1/6 = 5/6 (0.833) → 2/3 + 1/6 is greater', level: 'Hard' },
  { id: 20, type: 'Mixed Concept', q: 'Find missing fraction: 1/3 + [ ? ] = 5/6', ans: '[ ? ] = 5/6 - 2/6 = 3/6 = 1/2', level: 'Hard' },
];

const HOMEWORK_PROBLEMS = [
  {
    id: 1,
    title: 'Problem 1: Like Denominators',
    question: 'Calculate: 3/10 + 4/10 and write your answer in simplest form.',
    hint: 'Add the numerators (3 + 4) and keep the common denominator (10).',
    solution: '3/10 + 4/10 = 7/10',
  },
  {
    id: 2,
    title: 'Problem 2: Unlike Denominators with Halves',
    question: 'Calculate: 1/2 + 3/8 and show your working steps.',
    hint: 'Convert 1/2 to eighths first. 1/2 = 4/8.',
    solution: '1/2 + 3/8 = 4/8 + 3/8 = 7/8',
  },
  {
    id: 3,
    title: 'Problem 3: Thirds and Sixths',
    question: 'Anil solved 1/3 of problems and Priya solved 1/6. What fraction did they solve in total?',
    hint: 'Find the common denominator for 3 and 6, which is 6.',
    solution: '1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2',
  },
  {
    id: 4,
    title: 'Problem 4: Fourths and Twelfths',
    question: 'Find the sum: 3/4 + 1/12 in lowest terms.',
    hint: 'Convert 3/4 into twelfths: 3/4 = 9/12.',
    solution: '3/4 + 1/12 = 9/12 + 1/12 = 10/12 = 5/6',
  },
  {
    id: 5,
    title: 'Problem 5: Daily Challenge',
    question: 'A recipe needs 1/4 cup of sugar and 2/3 cup of flour. What is total fraction of dry ingredients?',
    hint: 'Common denominator of 4 and 3 is 12.',
    solution: '1/4 + 2/3 = 3/12 + 8/12 = 11/12 cup',
  },
];

const TEAMS = [
  { name: 'Team Alpha', target: '2/4 + 1/4 = 3/4', color: 'border-red-500/40 bg-red-500/10 text-red-400' },
  { name: 'Team Beta', target: '1/3 + 2/6 = 4/6 = 2/3', color: 'border-blue-500/40 bg-blue-500/10 text-blue-400' },
  { name: 'Team Gamma', target: '1/2 + 2/8 = 6/8 = 3/4', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
  { name: 'Team Delta', target: '3/8 + 1/4 = 5/8', color: 'border-purple-500/40 bg-purple-500/10 text-purple-400' },
];

export default function TeacherRecommendationsModal({
  type,
  isOpen,
  onClose,
  onAssign,
}: TeacherRecommendationsModalProps) {
  const { lang, tr } = useI18n();

  const [showAnswers, setShowAnswers] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  // Pizza simulation state for group activity
  const [selectedSlices, setSelectedSlices] = useState<number[]>([0, 1, 2]);
  const totalSlices = 8;

  const handlePrint = () => {
    window.print();
  };

  const handleAssignAction = (title: string) => {
    try {
      const existing = localStorage.getItem('vidya_assigned_activities');
      const list = existing ? JSON.parse(existing) : [];

      let questionsList = [];
      if (type === 'worksheet') {
        questionsList = WORKSHEET_PROBLEMS.slice(0, 10).map((p) => ({
          id: `ws-${p.id}`,
          type: 'Math Calculation',
          text: p.q,
          answer: p.ans,
          marks: p.level === 'Hard' ? 2 : 1,
          source: 'Teacher Fraction Worksheet',
          hint: `Difficulty: ${p.level}. Add numerators and simplify denominator.`,
          solution: `Step-by-step solution: ${p.q} = ${p.ans}`,
        }));
      } else if (type === 'homework') {
        questionsList = HOMEWORK_PROBLEMS.map((p) => ({
          id: `hw-${p.id}`,
          type: 'Short Answer',
          text: `${p.title}: ${p.question}`,
          answer: p.solution,
          hint: p.hint,
          solution: p.solution,
          marks: 2,
          source: 'Teacher Daily 5 Homework',
        }));
      } else {
        questionsList = TEAMS.map((t, idx) => ({
          id: `grp-${idx + 1}`,
          type: 'Math Calculation',
          text: `${t.name} Challenge: Find the combined sum: ${t.target.split('=')[0]?.trim() || t.target}`,
          answer: t.target.split('=').pop()?.trim() || t.target,
          hint: 'Collaborative pizza puzzle. Sum up the assigned slices and simplify.',
          solution: t.target,
          marks: 2,
          source: 'Group Pizza Puzzle',
        }));
      }

      const totalMarks = questionsList.reduce((acc, q) => acc + q.marks, 0) || 10;

      list.unshift({
        id: `rec-${Date.now()}`,
        title,
        subject: 'Mathematics',
        topic: 'Adding & Subtracting Fractions',
        assignedDate: new Date().toISOString(),
        type: type === 'worksheet' ? 'Worksheet' : type === 'homework' ? 'Homework' : 'Activity',
        status: 'Assigned',
        dueDate: 'Next Class',
        teacherName: localStorage.getItem('vidya_auth_name') || 'Dr. Sarah Rao',
        totalMarks,
        questions: questionsList,
      });
      localStorage.setItem('vidya_assigned_activities', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('vidya-activities-updated'));
    } catch {
      // ignore
    }

    setAssignedSuccess(true);
    onAssign?.(type || 'activity', title);
    setTimeout(() => setAssignedSuccess(false), 3000);
  };

  if (!isOpen || !type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-primary/30 bg-[#0c1024]/95 shadow-[0_0_60px_rgba(0,210,255,0.25)] flex flex-col text-foreground"
        >
          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-gradient-to-r from-primary/15 via-accent/10 to-transparent px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-[0_0_20px_rgba(0,210,255,0.4)]">
                {type === 'worksheet' ? (
                  <FileText className="h-6 w-6" />
                ) : type === 'homework' ? (
                  <BookOpen className="h-6 w-6" />
                ) : (
                  <UsersRound className="h-6 w-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-display text-white">
                    {type === 'worksheet' && 'Auto-Generated Fraction Worksheet'}
                    {type === 'homework' && 'Daily 5 Fraction Homework & Solutions'}
                    {type === 'group' && 'Pizza Fraction Puzzle — Group Activity'}
                  </h2>
                  <Badge variant="outline" className="border-primary/40 bg-primary/15 text-primary text-[11px] font-semibold">
                    {type === 'worksheet' ? '20 Problems' : type === 'homework' ? '5 Daily Tasks' : '4 Teams'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {type === 'worksheet' && 'Classroom printable and digital assignment with auto-graded solution keys'}
                  {type === 'homework' && 'Targeted daily practice to reinforce adding like and unlike denominators'}
                  {type === 'group' && 'Collaborative hands-on pizza slice activity for 4 student groups'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-border/60 text-xs hidden sm:flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>

              <Button
                size="sm"
                onClick={() =>
                  handleAssignAction(
                    type === 'worksheet'
                      ? 'Adding Fractions Worksheet (20 Problems)'
                      : type === 'homework'
                      ? 'Daily 5 Fractions Homework'
                      : 'Pizza Fraction Group Puzzle'
                  )
                }
                disabled={assignedSuccess}
                className={cn(
                  'text-xs font-semibold shadow-md transition-all',
                  assignedSuccess
                    ? 'bg-success text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                )}
              >
                {assignedSuccess ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Assigned!
                  </>
                ) : (
                  <>
                    <Share2 className="mr-1.5 h-3.5 w-3.5" />
                    Assign to Students
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* ─── 1. WORKSHEET VIEW ─── */}
            {type === 'worksheet' && (
              <div className="space-y-5">
                {/* TOOLBAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/10 p-3.5">
                  <div className="flex items-center gap-1.5">
                    {['All', 'Like Denominators', 'Unlike Denominators', 'Word Problem', 'Mixed Concept'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          'rounded-xl px-3 py-1 text-xs font-semibold transition border',
                          activeCategory === cat
                            ? 'bg-primary/20 text-primary border-primary/40'
                            : 'bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="border-primary/40 text-primary text-xs"
                  >
                    {showAnswers ? <EyeOff className="mr-1.5 h-3.5 w-3.5" /> : <Eye className="mr-1.5 h-3.5 w-3.5" />}
                    {showAnswers ? 'Hide Answer Key' : 'Show Answer Key'}
                  </Button>
                </div>

                {/* PROBLEMS GRID */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {WORKSHEET_PROBLEMS.filter(
                    (p) => activeCategory === 'All' || p.type === activeCategory
                  ).map((prob) => (
                    <div
                      key={prob.id}
                      className="rounded-2xl border border-border/60 bg-muted/20 p-4 hover:border-primary/40 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-muted-foreground">
                            Problem #{prob.id} • {prob.type}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                              prob.level === 'Easy'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : prob.level === 'Medium'
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-rose-500/15 text-rose-400'
                            )}
                          >
                            {prob.level}
                          </span>
                        </div>

                        <p className="font-semibold text-sm text-white mb-2">{prob.q}</p>
                      </div>

                      {showAnswers && (
                        <div className="mt-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs font-mono font-bold text-emerald-400">
                          Answer: {prob.ans}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 2. HOMEWORK VIEW ─── */}
            {type === 'homework' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Daily 5 Problem Set</h4>
                      <p className="text-xs text-muted-foreground">
                        Estimated Completion Time: 15–20 minutes • Auto-synced with Student Dashboard
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/40">5 Tasks</Badge>
                </div>

                <div className="space-y-4">
                  {HOMEWORK_PROBLEMS.map((hw) => (
                    <Card key={hw.id} className="glass p-5 border-border/60">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-sm font-bold text-primary">{hw.title}</h4>
                        <Badge variant="outline" className="text-[10px]">
                          Day #1
                        </Badge>
                      </div>

                      <p className="text-sm font-semibold text-white mb-3">{hw.question}</p>

                      <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-border/40 text-xs">
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-amber-300">
                          <span className="font-bold">Student Hint: </span>
                          {hw.hint}
                        </div>
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-emerald-400 font-mono">
                          <span className="font-bold">Solution: </span>
                          {hw.solution}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 3. GROUP ACTIVITY VIEW ─── */}
            {type === 'group' && (
              <div className="space-y-6">
                {/* INTERACTIVE PIZZA FRACTION CUTTER */}
                <div className="rounded-2xl border border-border/80 bg-black/40 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        Interactive Pizza Fraction Simulator (8 Slices)
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Click on slices to represent portions. Current selected:{' '}
                        <span className="font-mono text-cyan-300 font-bold">
                          {selectedSlices.length}/{totalSlices} (
                          {selectedSlices.length === 4
                            ? '1/2'
                            : selectedSlices.length === 2
                            ? '1/4'
                            : selectedSlices.length === 6
                            ? '3/4'
                            : `${selectedSlices.length}/8`}
                          )
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSlices([0, 1, 2, 3])}
                        className="text-xs"
                      >
                        Set 1/2 (4 slices)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSlices([0, 1])}
                        className="text-xs"
                      >
                        Set 1/4 (2 slices)
                      </Button>
                    </div>
                  </div>

                  {/* Slices bar representation */}
                  <div className="flex h-12 overflow-hidden rounded-2xl border border-border/80 bg-muted/30 shadow-inner">
                    {Array.from({ length: totalSlices }).map((_, i) => {
                      const isSelected = selectedSlices.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSlices(selectedSlices.filter((s) => s !== i));
                            } else {
                              setSelectedSlices([...selectedSlices, i]);
                            }
                          }}
                          className={cn(
                            'flex-1 flex items-center justify-center font-mono text-xs font-bold transition border-r border-background/40 last:border-r-0',
                            isSelected
                              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                              : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
                          )}
                        >
                          🍕 1/8
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4 TEAMS BREAKDOWN */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {TEAMS.map((team, idx) => (
                    <Card key={idx} className={cn('glass p-4 border', team.color)}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">{team.name} (4 Students)</h4>
                        <Badge variant="outline" className="text-[10px]">
                          Team #{idx + 1}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        Team Challenge Objective: Combine assigned slices to prove:
                      </p>

                      <div className="rounded-xl border border-white/20 bg-black/40 p-2.5 font-mono text-xs font-bold text-white text-center">
                        {team.target}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-6 py-3.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>EDUSense AI Teacher Intelligence Engine Ready</span>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
