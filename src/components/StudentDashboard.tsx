import {
  useEffect,
  useMemo,
  useState,
  type SVGProps,
} from 'react';

import { motion } from 'framer-motion';

import {
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  PlayCircle,
  Target,
  Trophy,
  Video,
  ExternalLink,
  ClipboardList,
  Sparkles,
  Search,
  Filter,
  Check,
  AlertCircle,
  RotateCcw,
  Layers,
  Flame,
} from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import StudentAssignmentModal, {
  type StudentAssignment,
  type AssignmentQuestion,
  type SubmissionData,
} from '@/components/StudentAssignmentModal';
import { api } from '@/lib/api';

/* =========================================================
   TYPES
========================================================= */

type VideoExplanation = {
  id: string;
  title: string;
  subject: string;
  description: string;
  videoUrl: string;
  duration: string;
  teacher: string;
  date: string;
  isTeacherPublished?: boolean;
};

type TeacherVideoExplanation = {
  id: string;
  title: string;
  subject: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  teacherName: string;
};

type ExamHistoryItem = {
  id: string;
  exam: string;
  subject: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  date: string;
};

type SubjectPerformance = {
  subject: string;
  score: number;
};

type MonthlyPerformance = {
  month: string;
  performance: number;
};

type StudentData = {
  student: {
    name: string;
    className: string;
    section: string;
    rollNumber: string;
  };

  attendance: {
    totalClasses: number;
    present: number;
    absent: number;
    percentage: number;
  };

  performance: {
    overall: number;
    subjects: SubjectPerformance[];
    monthly: MonthlyPerformance[];
  };

  exams: ExamHistoryItem[];
  videoExplanations: VideoExplanation[];
};

type PublishedAssessment = {
  id: string;
  title: string;
  subject: string;
  className: string;
  chapter: string;
  topic: string;
  teacherName: string;
  publishedAt: string;
  totalMarks: number;
  questions: Array<{
    id: number | string;
    type: string;
    text: string;
    answer: string;
    marks: number;
    source?: string;
  }>;
};

type StoredActivity = {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  assignedDate: string;
  type: string;
  status: string;
  dueDate: string;
  teacherName?: string;
  totalMarks?: number;
  questions?: AssignmentQuestion[];
};

/* =========================================================
   STORAGE KEYS
========================================================= */

const ASSESSMENT_STORAGE_KEY = 'edusense_published_assessments';
const TEACHER_VIDEO_STORAGE_KEY = 'vidya_teacher_video_explanations';
const TEACHER_VIDEO_UPDATED_EVENT = 'vidya-teacher-videos-updated';
const ASSIGNED_ACTIVITIES_STORAGE_KEY = 'vidya_assigned_activities';
const SUBMISSIONS_STORAGE_KEY = 'edusense_student_submissions';

/* =========================================================
   SEED CURRICULUM ASSIGNMENTS
========================================================= */

const seedCurriculumAssignments: StudentAssignment[] = [
  {
    id: 'as-math-1',
    title: 'Fractions & Common Denominators Worksheet',
    subject: 'Mathematics',
    topic: 'Adding & Subtracting Unlike Fractions',
    className: 'Class 10',
    teacherName: 'Prof. K. Sharma',
    assignedDate: '2026-08-20T09:00:00Z',
    dueDate: '25 Aug 2026',
    type: 'Worksheet',
    totalMarks: 10,
    durationMinutes: 15,
    status: 'pending',
    questions: [
      {
        id: 'q-m1',
        type: 'Math Calculation',
        text: 'Calculate the sum: 1/4 + 2/4 and write the simplest form.',
        answer: '3/4',
        hint: 'Same denominator: add the numerators 1 + 2.',
        solution: '1/4 + 2/4 = 3/4',
        marks: 2,
        source: 'Math Unit 3 Notes',
      },
      {
        id: 'q-m2',
        type: 'Math Calculation',
        text: 'Find the result of: 1/2 + 1/4.',
        answer: '3/4',
        hint: 'Convert 1/2 to 2/4 first, then add 1/4.',
        solution: '1/2 + 1/4 = 2/4 + 1/4 = 3/4',
        marks: 2,
        source: 'Math Unit 3 Notes',
      },
      {
        id: 'q-m3',
        type: 'MCQ',
        text: 'What is the Lowest Common Denominator (LCD) of 1/3 and 1/6?',
        options: ['6', '3', '18', '12'],
        answer: '6',
        hint: '6 is a multiple of 3.',
        solution: 'The smallest number divisible by both 3 and 6 is 6.',
        marks: 2,
        source: 'Math Unit 3 Notes',
      },
      {
        id: 'q-m4',
        type: 'True/False',
        text: 'The fractions 2/4 and 4/8 are equivalent fractions.',
        answer: 'True',
        hint: 'Both reduce to 1/2.',
        solution: 'True: 2/4 = 1/2 and 4/8 = 1/2.',
        marks: 2,
        source: 'Math Unit 3 Notes',
      },
      {
        id: 'q-m5',
        type: 'Short Answer',
        text: 'Ravi ate 1/3 of a watermelon and Sita ate 1/6. What fraction did they eat in total?',
        answer: '1/2',
        hint: '1/3 + 1/6 = 2/6 + 1/6 = 3/6.',
        solution: '2/6 + 1/6 = 3/6 = 1/2',
        marks: 2,
        source: 'Word Problems Section',
      },
    ],
  },
  {
    id: 'as-cs-1',
    title: 'Data Structures: Stacks, Queues & Search Algorithms',
    subject: 'Computer Science',
    topic: 'Stacks & Queues in Practice',
    className: 'Class 10',
    teacherName: 'Dr. Sarah Rao',
    assignedDate: '2026-08-21T11:30:00Z',
    dueDate: '28 Aug 2026',
    type: 'Quiz',
    totalMarks: 10,
    durationMinutes: 12,
    status: 'pending',
    questions: [
      {
        id: 'q-cs1',
        type: 'MCQ',
        text: 'Which data structure strictly follows the First-In, First-Out (FIFO) principle?',
        options: ['Queue (FIFO)', 'Stack (LIFO)', 'Binary Tree', 'Priority Queue'],
        answer: 'Queue (FIFO)',
        hint: 'Think of a queue at a ticket counter.',
        solution: 'A queue follows FIFO: the first element inserted is the first element removed.',
        marks: 2,
        source: 'Chapter 4 Lesson Notes',
      },
      {
        id: 'q-cs2',
        type: 'True/False',
        text: 'Breadth-First Search (BFS) explores neighbor nodes using a FIFO queue.',
        answer: 'True',
        hint: 'BFS visits level-by-level using a queue.',
        solution: 'True: BFS uses a queue to traverse graph nodes level by level.',
        marks: 2,
        source: 'Chapter 4 Lesson Notes',
      },
      {
        id: 'q-cs3',
        type: 'MCQ',
        text: 'What is the time complexity of Binary Search on a sorted array of size n?',
        options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'],
        answer: 'O(log n)',
        hint: 'The search space is halved at each step.',
        solution: 'Binary search splits the search interval in half each time, leading to O(log n).',
        marks: 2,
        source: 'Algorithm Complexity Slide',
      },
      {
        id: 'q-cs4',
        type: 'MCQ',
        text: 'Which operation removes an element from the front of a queue?',
        options: ['Dequeue', 'Enqueue', 'Push', 'Pop'],
        answer: 'Dequeue',
        hint: 'Enqueue inserts; Dequeue deletes.',
        solution: 'Dequeue removes the front element from a queue.',
        marks: 2,
        source: 'Chapter 4 Lesson Notes',
      },
      {
        id: 'q-cs5',
        type: 'Short Answer',
        text: 'Explain the difference between LIFO and FIFO with one real-world example of each.',
        answer: 'LIFO (Last-In-First-Out) e.g., stack of plates; FIFO (First-In-First-Out) e.g., printer print queue.',
        hint: 'LIFO is Stack, FIFO is Queue.',
        solution: 'LIFO: Last inserted is first removed (plates stack). FIFO: First inserted is first removed (printer queue).',
        marks: 2,
        source: 'Previous Class Content',
      },
    ],
  },
  {
    id: 'as-sci-1',
    title: 'Photosynthesis & Plant Cell Architecture',
    subject: 'Science',
    topic: 'Cell Biology & Energy Conversion',
    className: 'Class 10',
    teacherName: 'Mr. Kamal',
    assignedDate: '2026-08-19T10:00:00Z',
    dueDate: '24 Aug 2026',
    type: 'Homework',
    totalMarks: 8,
    durationMinutes: 10,
    status: 'pending',
    questions: [
      {
        id: 'q-s1',
        type: 'MCQ',
        text: 'Which cellular organelle is the site of photosynthesis in green plants?',
        options: ['Chloroplast', 'Mitochondria', 'Nucleus', 'Endoplasmic Reticulum'],
        answer: 'Chloroplast',
        hint: 'Contains green chlorophyll pigment.',
        solution: 'Chloroplasts absorb solar energy to produce glucose.',
        marks: 2,
        source: 'Science Textbook Ch. 6',
      },
      {
        id: 'q-s2',
        type: 'True/False',
        text: 'Oxygen is released as a byproduct during photosynthesis.',
        answer: 'True',
        hint: 'Water molecules split, releasing O2.',
        solution: 'True: Photolysis of water releases oxygen gas into the atmosphere.',
        marks: 2,
        source: 'Science Textbook Ch. 6',
      },
      {
        id: 'q-s3',
        type: 'Short Answer',
        text: 'What are the three primary raw materials required for photosynthesis?',
        answer: 'Carbon dioxide, water, and sunlight (chlorophyll).',
        hint: 'CO2, H2O, and radiant solar energy.',
        solution: 'Plants need Carbon Dioxide (from air), Water (from roots), and Sunlight (trapped by chlorophyll).',
        marks: 2,
        source: 'Lab Experiment 2',
      },
      {
        id: 'q-s4',
        type: 'MCQ',
        text: 'What is the primary carbohydrate produced during photosynthesis?',
        options: ['Glucose', 'Sucrose', 'Starch', 'Glycogen'],
        answer: 'Glucose',
        hint: 'Chemical formula C6H12O6.',
        solution: 'Photosynthesis converts CO2 and H2O into glucose (C6H12O6).',
        marks: 2,
        source: 'Science Textbook Ch. 6',
      },
    ],
  },
  {
    id: 'as-eng-1',
    title: 'Grammar Precision: Tenses & Sentence Correction',
    subject: 'English',
    topic: 'Active & Passive Voice, Tense Alignment',
    className: 'Class 10',
    teacherName: 'Ms. Nisha',
    assignedDate: '2026-08-18T14:00:00Z',
    dueDate: '26 Aug 2026',
    type: 'Worksheet',
    totalMarks: 8,
    durationMinutes: 10,
    status: 'pending',
    questions: [
      {
        id: 'q-e1',
        type: 'MCQ',
        text: 'Identify the correct past continuous tense: "She _______ her homework when the bell rang."',
        options: ['was doing', 'did', 'is doing', 'had done'],
        answer: 'was doing',
        hint: 'Ongoing action in the past interrupted by another event.',
        solution: '"was doing" expresses past continuous action.',
        marks: 2,
        source: 'English Grammar Rules',
      },
      {
        id: 'q-e2',
        type: 'True/False',
        text: 'In passive voice, the subject of the sentence receives the action.',
        answer: 'True',
        hint: 'Active: Actor does action. Passive: Object receives action.',
        solution: 'True: Passive voice highlights the recipient of the action.',
        marks: 2,
        source: 'Voice & Syntax Module',
      },
      {
        id: 'q-e3',
        type: 'Short Answer',
        text: 'Convert this sentence into passive voice: "The teacher graded the assignments."',
        answer: 'The assignments were graded by the teacher.',
        hint: 'Start with "The assignments...".',
        solution: '"The assignments were graded by the teacher."',
        marks: 2,
        source: 'Classroom Exercise 5',
      },
      {
        id: 'q-e4',
        type: 'MCQ',
        text: 'Select the correctly punctuated sentence:',
        options: [
          'Although it was raining, we enjoyed our science field trip.',
          'Although it was raining we enjoyed our science field trip.',
          'Although, it was raining we enjoyed our science field trip.',
          'Although it was raining; we enjoyed our science field trip.',
        ],
        answer: 'Although it was raining, we enjoyed our science field trip.',
        hint: 'A dependent clause followed by an independent clause requires a comma.',
        solution: 'Use a comma after the introductory dependent clause.',
        marks: 2,
        source: 'Punctuation Guidelines',
      },
    ],
  },
];

/* =========================================================
   READ PUBLISHED ASSESSMENTS & ACTIVITIES
========================================================= */

function readPublishedAssessments(): PublishedAssessment[] {
  try {
    const saved = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is PublishedAssessment => {
      if (!item || typeof item !== 'object') return false;
      const assessment = item as Record<string, unknown>;
      return (
        typeof assessment.id === 'string' &&
        typeof assessment.title === 'string' &&
        typeof assessment.subject === 'string' &&
        Array.isArray(assessment.questions)
      );
    });
  } catch {
    return [];
  }
}

function readTeacherAssignedActivities(): StoredActivity[] {
  try {
    const saved = localStorage.getItem(ASSIGNED_ACTIVITIES_STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is StoredActivity => {
      return Boolean(item && typeof item === 'object' && typeof (item as StoredActivity).title === 'string');
    });
  } catch {
    return [];
  }
}

function readStudentSubmissions(): Record<string, SubmissionData> {
  try {
    const saved = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === 'object') return parsed as Record<string, SubmissionData>;
    return {};
  } catch {
    return {};
  }
}

function saveStudentSubmissions(submissions: Record<string, SubmissionData>) {
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
    window.dispatchEvent(new CustomEvent('edusense-assignment-submitted'));
  } catch {
    // ignore
  }
}

function readTeacherVideos(): TeacherVideoExplanation[] {
  try {
    const saved = localStorage.getItem(TEACHER_VIDEO_STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is TeacherVideoExplanation => {
      if (!item || typeof item !== 'object') return false;
      const video = item as Record<string, unknown>;
      return (
        typeof video.id === 'string' &&
        typeof video.title === 'string' &&
        typeof video.subject === 'string' &&
        typeof video.videoUrl === 'string'
      );
    });
  } catch {
    return [];
  }
}

/* =========================================================
   DEFAULT STUDENT DATA
========================================================= */

const defaultData: StudentData = {
  student: {
    name: 'Aarav Reddy',
    className: 'Class 10',
    section: 'A',
    rollNumber: 'SNIST10A042',
  },

  attendance: {
    totalClasses: 120,
    present: 110,
    absent: 10,
    percentage: 92,
  },

  performance: {
    overall: 88,

    subjects: [
      { subject: 'Mathematics', score: 92 },
      { subject: 'Science', score: 89 },
      { subject: 'English', score: 85 },
      { subject: 'Social Science', score: 86 },
      { subject: 'Computer Science', score: 96 },
    ],

    monthly: [
      { month: 'Jan', performance: 76 },
      { month: 'Feb', performance: 80 },
      { month: 'Mar', performance: 82 },
      { month: 'Apr', performance: 85 },
      { month: 'May', performance: 88 },
      { month: 'Jun', performance: 92 },
    ],
  },

  exams: [
    {
      id: '1',
      exam: 'Mid-Term Exam',
      subject: 'Computer Science',
      marks: 48,
      totalMarks: 50,
      percentage: 96,
      grade: 'A+',
      date: '14 Aug 2026',
    },
    {
      id: '2',
      exam: 'Unit Test 2',
      subject: 'Mathematics',
      marks: 46,
      totalMarks: 50,
      percentage: 92,
      grade: 'A',
      date: '08 Aug 2026',
    },
    {
      id: '3',
      exam: 'Diagnostic Test',
      subject: 'Science',
      marks: 43,
      totalMarks: 50,
      percentage: 86,
      grade: 'A',
      date: '02 Aug 2026',
    },
  ],

  videoExplanations: [
    {
      id: 'v1',
      title: 'Fractions in Daily Life',
      subject: 'Mathematics',
      description: 'Learn how fractions are used in shopping, cooking, and measurements.',
      videoUrl: 'https://example.com/video/fractions',
      duration: '12 min',
      teacher: 'Prof. K. Sharma',
      date: 'Today',
    },
    {
      id: 'v2',
      title: 'Photosynthesis & Plant Energy',
      subject: 'Science',
      description: 'Break down how plants make food and release oxygen.',
      videoUrl: 'https://example.com/video/photosynthesis',
      duration: '15 min',
      teacher: 'Mr. Kamal',
      date: 'Yesterday',
    },
    {
      id: 'v3',
      title: 'Breadth-First Search & FIFO Queues',
      subject: 'Computer Science',
      description: 'Visual walkthrough of graph search traversal and node expansions.',
      videoUrl: 'https://example.com/video/bfs',
      duration: '14 min',
      teacher: 'Dr. Sarah Rao',
      date: '20 Aug',
    },
  ],
};

/* =========================================================
   STUDENT DASHBOARD COMPONENT
========================================================= */

export default function StudentDashboard() {
  const [selectedSubject, setSelectedSubject] = useState(defaultData.performance.subjects[0].subject);
  const [teacherAssessments, setTeacherAssessments] = useState<PublishedAssessment[]>([]);
  const [teacherActivities, setTeacherActivities] = useState<StoredActivity[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, SubmissionData>>({});
  const [teacherVideos, setTeacherVideos] = useState<TeacherVideoExplanation[]>([]);

  // Filter & Search States
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [selectedAssignmentModal, setSelectedAssignmentModal] = useState<StudentAssignment | null>(null);
  const [modalMode, setModalMode] = useState<'answering' | 'review'>('answering');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /* =======================================================
     LOAD ASSESSMENTS, ACTIVITIES & SUBMISSIONS
  ======================================================= */

  const syncAllData = () => {
    setTeacherAssessments(readPublishedAssessments());
    setTeacherActivities(readTeacherAssignedActivities());
    setSubmissions(readStudentSubmissions());
    setTeacherVideos(readTeacherVideos());
  };

  useEffect(() => {
    syncAllData();

    window.addEventListener('edusense-assessments-updated', syncAllData);
    window.addEventListener('vidya-activities-updated', syncAllData);
    window.addEventListener('edusense-assignment-submitted', syncAllData);
    window.addEventListener(TEACHER_VIDEO_UPDATED_EVENT, syncAllData);
    window.addEventListener('storage', syncAllData);

    return () => {
      window.removeEventListener('edusense-assessments-updated', syncAllData);
      window.removeEventListener('vidya-activities-updated', syncAllData);
      window.removeEventListener('edusense-assignment-submitted', syncAllData);
      window.removeEventListener(TEACHER_VIDEO_UPDATED_EVENT, syncAllData);
      window.removeEventListener('storage', syncAllData);
    };
  }, []);

  /* =======================================================
     UNIFIED ASSIGNMENTS LIST
  ======================================================= */

  const allAssignments = useMemo<StudentAssignment[]>(() => {
    const list: StudentAssignment[] = [];

    // 1. Teacher-published AI Quizzes from Quiz Generator
    teacherAssessments.forEach((pa) => {
      const qList: AssignmentQuestion[] = (pa.questions || []).map((q) => ({
        id: q.id,
        type: q.type || 'MCQ',
        text: q.text,
        answer: q.answer,
        marks: Number(q.marks) || 2,
        source: q.source || `${pa.chapter} • ${pa.topic}`,
        hint: `Focus on ${pa.topic}`,
        solution: `Correct answer is: ${q.answer}`,
      }));

      const totalMarks = pa.totalMarks || qList.reduce((sum, q) => sum + q.marks, 0) || 10;
      const sub = submissions[pa.id];

      list.push({
        id: pa.id,
        title: pa.title,
        subject: pa.subject || 'Computer Science',
        topic: pa.topic || pa.chapter || 'Classroom Assessment',
        className: pa.className || 'Class 10',
        teacherName: pa.teacherName || 'Dr. Sarah Rao',
        assignedDate: pa.publishedAt,
        dueDate: 'Due Today',
        type: 'Assessment',
        totalMarks,
        durationMinutes: 15,
        questions: qList,
        status: sub ? 'submitted' : 'pending',
        score: sub?.score,
        percentage: sub?.percentage,
        grade: sub?.grade,
        submittedAt: sub?.submittedAt,
        feedback: sub?.feedback,
        studentAnswers: sub?.studentAnswers,
        questionResults: sub?.questionResults,
      });
    });

    // 2. Teacher-assigned Worksheets & Homework from Teacher Recommendations
    teacherActivities.forEach((act) => {
      const questionsList = act.questions && act.questions.length > 0 ? act.questions : [
        {
          id: `${act.id}-q1`,
          type: 'Math Calculation',
          text: `Complete the ${act.title} problem set for ${act.subject}.`,
          answer: 'Completed',
          marks: 5,
          hint: 'Follow teacher instructions.',
          solution: 'Solution verified.',
        },
      ];

      const totalMarks = act.totalMarks || questionsList.reduce((sum, q) => sum + q.marks, 0) || 10;
      const sub = submissions[act.id];

      list.push({
        id: act.id,
        title: act.title,
        subject: act.subject || 'Mathematics',
        topic: act.topic || 'Classroom Practice',
        teacherName: act.teacherName || 'Dr. Sarah Rao',
        assignedDate: act.assignedDate || new Date().toISOString(),
        dueDate: act.dueDate || 'Tomorrow',
        type: (act.type as StudentAssignment['type']) || 'Worksheet',
        totalMarks,
        durationMinutes: 15,
        questions: questionsList,
        status: sub ? 'submitted' : 'pending',
        score: sub?.score,
        percentage: sub?.percentage,
        grade: sub?.grade,
        submittedAt: sub?.submittedAt,
        feedback: sub?.feedback,
        studentAnswers: sub?.studentAnswers,
        questionResults: sub?.questionResults,
      });
    });

    // 3. Seed curriculum assignments
    seedCurriculumAssignments.forEach((seed) => {
      // Don't duplicate if already present
      if (list.some((item) => item.id === seed.id)) return;

      const sub = submissions[seed.id];
      list.push({
        ...seed,
        status: sub ? 'submitted' : 'pending',
        score: sub?.score,
        percentage: sub?.percentage,
        grade: sub?.grade,
        submittedAt: sub?.submittedAt,
        feedback: sub?.feedback,
        studentAnswers: sub?.studentAnswers,
        questionResults: sub?.questionResults,
      });
    });

    return list;
  }, [teacherAssessments, teacherActivities, submissions]);

  /* =======================================================
     FILTERED ASSIGNMENTS
  ======================================================= */

  const filteredAssignments = useMemo(() => {
    return allAssignments.filter((assignment) => {
      // Status filter
      if (statusFilter === 'pending' && assignment.status !== 'pending') return false;
      if (statusFilter === 'completed' && assignment.status !== 'submitted' && assignment.status !== 'graded') return false;

      // Subject filter
      if (subjectFilter !== 'all' && assignment.subject.toLowerCase() !== subjectFilter.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = assignment.title.toLowerCase().includes(query);
        const matchesTopic = assignment.topic.toLowerCase().includes(query);
        const matchesTeacher = assignment.teacherName.toLowerCase().includes(query);
        const matchesSubject = assignment.subject.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTopic && !matchesTeacher && !matchesSubject) return false;
      }

      return true;
    });
  }, [allAssignments, statusFilter, subjectFilter, searchQuery]);

  // Counts & Statistics
  const pendingCount = allAssignments.filter((a) => a.status === 'pending').length;
  const completedCount = allAssignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length;
  const averageAssignmentScore = useMemo(() => {
    const scored = allAssignments.filter((a) => a.percentage !== undefined);
    if (scored.length === 0) return 92;
    const sum = scored.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    return Math.round(sum / scored.length);
  }, [allAssignments]);

  /* =======================================================
     HANDLE ASSIGNMENT SUBMISSION
  ======================================================= */

  const handleSubmitAssignment = (submissionData: SubmissionData) => {
    const updatedSubmissions = {
      ...submissions,
      [submissionData.assignmentId]: submissionData,
    };
    setSubmissions(updatedSubmissions);
    saveStudentSubmissions(updatedSubmissions);

    // Sync to backend if active
    api.student.submitAssignment(submissionData as unknown as Record<string, unknown>).catch(() => {
      // localStorage is primary fallback
    });

    // Update assignment in modal
    if (selectedAssignmentModal && selectedAssignmentModal.id === submissionData.assignmentId) {
      setSelectedAssignmentModal((prev) =>
        prev
          ? {
              ...prev,
              status: 'submitted',
              score: submissionData.score,
              percentage: submissionData.percentage,
              grade: submissionData.grade,
              submittedAt: submissionData.submittedAt,
              studentAnswers: submissionData.studentAnswers,
              questionResults: submissionData.questionResults,
            }
          : null
      );
    }
  };

  const handleOpenAssignment = (assignment: StudentAssignment, mode: 'answering' | 'review') => {
    setSelectedAssignmentModal(assignment);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  /* =======================================================
     VIDEO LIBRARY
  ======================================================= */

  const publishedVideos = useMemo<VideoExplanation[]>(() => {
    return teacherVideos.map((video) => ({
      id: `teacher-${video.id}`,
      title: video.title,
      subject: video.subject,
      description: video.description,
      videoUrl: video.videoUrl,
      duration: 'Teacher upload',
      teacher: video.teacherName,
      date: new Date(video.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      isTeacherPublished: true,
    }));
  }, [teacherVideos]);

  const videoLibrary = useMemo<VideoExplanation[]>(() => {
    return [...publishedVideos, ...defaultData.videoExplanations];
  }, [publishedVideos]);

  /* =======================================================
     EXAM HISTORY SYNCED WITH COMPLETED ASSIGNMENTS
  ======================================================= */

  const examHistory = useMemo(() => {
    const submittedExams: ExamHistoryItem[] = allAssignments
      .filter((a) => a.status === 'submitted' || a.status === 'graded')
      .map((a) => ({
        id: `sub-${a.id}`,
        exam: a.title,
        subject: a.subject,
        marks: a.score || 0,
        totalMarks: a.totalMarks,
        percentage: a.percentage || 0,
        grade: a.grade || 'A',
        date: a.submittedAt
          ? new Date(a.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
          : 'Today',
      }));

    return [...submittedExams, ...defaultData.exams];
  }, [allAssignments]);

  const selectedSubjectScore = useMemo(
    () =>
      defaultData.performance.subjects.find((subject) => subject.subject === selectedSubject) ??
      defaultData.performance.subjects[0],
    [selectedSubject]
  );

  /* =======================================================
     STAT CARDS
  ======================================================= */

  const statCards = [
    {
      title: 'Overall Score',
      value: `${defaultData.performance.overall}%`,
      delta: '+4.2% this term',
      icon: Trophy,
      tone: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    },
    {
      title: 'Assignments Done',
      value: `${completedCount} / ${allAssignments.length}`,
      delta: pendingCount > 0 ? `${pendingCount} pending to answer` : 'All tasks up to date',
      icon: ClipboardList,
      tone:
        pendingCount > 0
          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    },
    {
      title: 'Assignment Avg',
      value: `${averageAssignmentScore}%`,
      delta: 'Target: 90%+',
      icon: Target,
      tone: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    },
    {
      title: 'Study Streak',
      value: '14 days',
      delta: 'Active daily',
      icon: Flame,
      tone: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-7">
      {/* ===================================================
          HERO BANNER
      =================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/30 via-card/90 to-pink-950/20 p-6 sm:p-7 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-0.5 text-xs font-semibold text-cyan-300">
              <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
              Student Learning Hub • Retro Fusion
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome, {defaultData.student.name}
            </h1>

            <p className="mt-1.5 text-sm text-muted-foreground">
              {defaultData.student.className} • Section {defaultData.student.section} • Roll No.{' '}
              <span className="font-mono text-cyan-300 font-semibold">{defaultData.student.rollNumber}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {pendingCount > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 min-w-[150px]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Action Required
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-300">
                  {pendingCount} {pendingCount === 1 ? 'Assignment' : 'Assignments'}
                </p>
                <p className="text-xs text-muted-foreground">Pending to answer</p>
              </div>
            )}

            <div className="rounded-2xl border border-border/80 bg-muted/20 p-3.5 min-w-[140px]">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Attendance</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {defaultData.attendance.present} / {defaultData.attendance.totalClasses}
              </p>
              <p className="text-xs text-emerald-400">{defaultData.attendance.percentage}% Present</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===================================================
          STATISTICS CARDS
      =================================================== */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ title, value, delta, icon: Icon, tone }) => (
          <Card key={title} className="border-border/60 bg-card/75 backdrop-blur-sm hover:border-cyan-500/30 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
                </div>
                <div className={cn('rounded-2xl p-3', tone)}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===================================================
          FEATURED: ASSIGNMENTS & QUIZZES HUB
      =================================================== */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold">Assignments & Quizzes</CardTitle>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Answer assignments given by your teachers, take AI quizzes, and review evaluated solutions.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={cn(
                'rounded-lg text-xs font-semibold gap-1.5',
                statusFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              All ({allAssignments.length})
            </Button>

            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
              className={cn(
                'rounded-lg text-xs font-semibold gap-1.5',
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'
              )}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              To Answer ({pendingCount})
            </Button>

            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
              className={cn(
                'rounded-lg text-xs font-semibold gap-1.5',
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed ({completedCount})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-5">
          {/* Search & Subject Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assignments by title, topic, or teacher..."
                className="pl-10 rounded-lg border-border bg-muted/20 text-sm focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Subject:
              </span>
              {['all', 'Mathematics', 'Computer Science', 'Science', 'English'].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubjectFilter(sub)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    subjectFilter.toLowerCase() === sub.toLowerCase()
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'bg-muted/30 text-muted-foreground hover:text-foreground border border-transparent'
                  )}
                >
                  {sub === 'all' ? 'All Subjects' : sub}
                </button>
              ))}
            </div>
          </div>

          {/* Assignments Grid */}
          {filteredAssignments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 p-10 text-center space-y-3">
              <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <p className="font-semibold text-foreground">No assignments match your filter</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try selecting &ldquo;All Assignments&rdquo; or clearing your search term to see all available tasks.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setSubjectFilter('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredAssignments.map((assignment) => {
                const isCompleted = assignment.status === 'submitted' || assignment.status === 'graded';

                return (
                  <div
                    key={assignment.id}
                    className={cn(
                      'group relative flex flex-col justify-between rounded-xl border p-5 transition hover:border-border hover:shadow-md',
                      isCompleted
                        ? 'border-emerald-500/20 bg-emerald-950/10'
                        : 'border-border/80 bg-card'
                    )}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs font-medium',
                            assignment.subject === 'Mathematics'
                              ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                              : assignment.subject === 'Computer Science'
                              ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
                              : assignment.subject === 'Science'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                              : 'border-purple-500/30 text-purple-400 bg-purple-500/10'
                          )}
                        >
                          {assignment.subject}
                        </Badge>

                        {isCompleted ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px] font-medium gap-1">
                            <Check className="h-3 w-3" /> Graded {assignment.percentage}%
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[11px] font-medium">
                            To Answer
                          </Badge>
                        )}
                      </div>

                      {/* Title & Topic */}
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {assignment.title}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        Topic: <span className="text-foreground font-medium">{assignment.topic}</span>
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Assigned by <span className="text-foreground font-medium">{assignment.teacherName}</span>
                      </p>

                      {/* Meta Pills */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-t border-border/40 pt-3">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-primary" />
                          {assignment.questions?.length || 5} Questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5 text-amber-500" />
                          {assignment.totalMarks} Marks
                        </span>
                        <span className="flex items-center gap-1 font-medium text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {assignment.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-border/40">
                      {isCompleted ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Score:</span>
                            <span className="font-bold text-emerald-400 font-mono">
                              {assignment.score} / {assignment.totalMarks} ({assignment.grade})
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleOpenAssignment(assignment, 'review')}
                              className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold"
                              size="sm"
                            >
                              <FileText className="mr-1.5 h-3.5 w-3.5" />
                              Review Answers
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() => handleOpenAssignment(assignment, 'answering')}
                              size="sm"
                              className="border-border text-xs text-muted-foreground hover:text-foreground"
                              title="Retake for practice"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleOpenAssignment(assignment, 'answering')}
                          className="w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-pink-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:shadow-[0_0_25px_rgba(0,210,255,0.5)] transition-all"
                          size="sm"
                        >
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          Answer Assignment
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===================================================
          PERFORMANCE & SUBJECT FOCUS
      =================================================== */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Growth Tracking</p>
              <CardTitle className="mt-1 text-xl font-bold">Monthly Performance Trend</CardTitle>
            </div>
            <Badge variant="outline" className="rounded-full border-cyan-500/30 text-cyan-300 font-mono text-xs">
              +16 pts this year
            </Badge>
          </CardHeader>

          <CardContent className="h-72 p-4 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defaultData.performance.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1024',
                    border: '1px solid rgba(0,210,255,0.3)',
                    borderRadius: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#00d2ff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00d2ff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SUBJECT FOCUS */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject Mastery</p>
            <CardTitle className="text-xl font-bold">Current Subject Focus</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {defaultData.performance.subjects.map((subject) => (
              <button
                key={subject.subject}
                type="button"
                onClick={() => setSelectedSubject(subject.subject)}
                className={cn(
                  'w-full rounded-2xl border p-3.5 text-left transition-all',
                  selectedSubject === subject.subject
                    ? 'border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,210,255,0.1)]'
                    : 'border-border/50 bg-card hover:border-border'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-sm text-foreground">{subject.subject}</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">{subject.score}%</span>
                </div>
                <Progress value={subject.score} className="mt-2.5 h-1.5" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ===================================================
          EXAMS & ASSIGNMENT RESULTS HISTORY
      =================================================== */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verified Scores</p>
              <CardTitle className="mt-1 text-xl font-bold">Exam & Assessment History</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {examHistory.length} Recorded
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            {examHistory.slice(0, 5).map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{exam.exam}</span>
                    <Badge variant="secondary" className="text-[11px]">
                      {exam.subject}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{exam.date}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-base font-bold text-foreground font-mono">
                      {exam.marks}/{exam.totalMarks}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{exam.percentage}%</p>
                  </div>

                  <Badge
                    className={cn(
                      'min-w-[2.5rem] justify-center rounded-full font-bold text-xs',
                      exam.grade.includes('A') ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/15 text-cyan-300'
                    )}
                  >
                    {exam.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI LEARNING COACH */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Recommendation</p>
            <CardTitle className="text-xl font-bold">Adaptive Learning Support</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-400 border border-cyan-500/30">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">AI Learning Coach</p>
                  <p className="text-xs text-cyan-300">Focus Subject: {selectedSubjectScore.subject}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your current score is <strong className="text-foreground">{selectedSubjectScore.score}%</strong> in{' '}
                {selectedSubjectScore.subject}. Completing your pending worksheets and reviewing flashcard explanations
                will reinforce your conceptual retention.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                <p className="mt-2 font-semibold text-sm text-foreground">Target Practice</p>
                <p className="mt-1 text-xs text-muted-foreground">Interactive drills available</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <CalendarDays className="h-5 w-5 text-cyan-400" />
                <p className="mt-2 font-semibold text-sm text-foreground">Revision Plan</p>
                <p className="mt-1 text-xs text-muted-foreground">2 sprints scheduled this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===================================================
          TEACHER VIDEO LESSON LIBRARY
      =================================================== */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Video Explanations</p>
            <CardTitle className="mt-1 text-xl font-bold">Teacher Explanation Library</CardTitle>
            {teacherVideos.length > 0 && (
              <p className="mt-1 text-xs text-emerald-400 font-medium">
                {teacherVideos.length} teacher upload{teacherVideos.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          <Button variant="outline" size="sm" className="gap-2 text-xs border-border/70">
            <Video className="h-4 w-4 text-cyan-400" />
            Watch All Explanations
          </Button>
        </CardHeader>

        <CardContent>
          {videoLibrary.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center">
              <Video className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-semibold">No video explanations yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Teacher published videos will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {videoLibrary.map((video) => (
                <div
                  key={video.id}
                  className={cn(
                    'rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
                    video.isTeacherPublished
                      ? 'border-cyan-500/40 bg-cyan-950/20'
                      : 'border-border/60 bg-muted/20'
                  )}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {video.subject}
                    </Badge>
                    {video.isTeacherPublished ? (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                        New Upload
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">{video.date}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{video.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{video.teacher}</p>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {video.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {video.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      Lesson Notes
                    </span>
                  </div>

                  {video.videoUrl && (
                    <a href={video.videoUrl} target="_blank" rel="noreferrer" className="mt-3 block">
                      <Button
                        type="button"
                        size="sm"
                        className="w-full gap-2 text-xs"
                        variant={video.isTeacherPublished ? 'default' : 'outline'}
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        Watch Explanation
                        <ExternalLink className="ml-auto h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===================================================
          INTERACTIVE STUDENT ASSIGNMENT MODAL
      =================================================== */}
      <StudentAssignmentModal
        assignment={selectedAssignmentModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitAssignment={handleSubmitAssignment}
        initialMode={modalMode}
      />
    </div>
  );
}