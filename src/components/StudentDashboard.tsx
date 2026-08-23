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
import { cn } from '@/lib/utils';

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
    id: number;
    type: string;
    text: string;
    answer: string;
    marks: number;
    source?: string;
  }>;
};

/* =========================================================
   STORAGE KEYS
========================================================= */

const ASSESSMENT_STORAGE_KEY =
  'edusense_published_assessments';

const TEACHER_VIDEO_STORAGE_KEY =
  'vidya_teacher_video_explanations';

const TEACHER_VIDEO_UPDATED_EVENT =
  'vidya-teacher-videos-updated';

/* =========================================================
   READ PUBLISHED ASSESSMENTS
========================================================= */

function readPublishedAssessments(): PublishedAssessment[] {
  try {
    const saved = localStorage.getItem(
      ASSESSMENT_STORAGE_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is PublishedAssessment => {
        if (
          !item ||
          typeof item !== 'object'
        ) {
          return false;
        }

        const assessment =
          item as Record<string, unknown>;

        return (
          typeof assessment.id === 'string' &&
          typeof assessment.title === 'string' &&
          typeof assessment.subject === 'string' &&
          typeof assessment.className === 'string' &&
          typeof assessment.chapter === 'string' &&
          typeof assessment.topic === 'string' &&
          typeof assessment.teacherName === 'string' &&
          typeof assessment.publishedAt === 'string' &&
          typeof assessment.totalMarks === 'number' &&
          Array.isArray(
            assessment.questions
          )
        );
      }
    );
  } catch {
    return [];
  }
}

/* =========================================================
   READ TEACHER VIDEOS
========================================================= */

function readTeacherVideos(): TeacherVideoExplanation[] {
  try {
    const saved = localStorage.getItem(
      TEACHER_VIDEO_STORAGE_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (
        item
      ): item is TeacherVideoExplanation => {
        if (
          !item ||
          typeof item !== 'object'
        ) {
          return false;
        }

        const video =
          item as Record<string, unknown>;

        return (
          typeof video.id === 'string' &&
          typeof video.title === 'string' &&
          typeof video.subject === 'string' &&
          typeof video.description === 'string' &&
          typeof video.videoUrl === 'string' &&
          typeof video.createdAt === 'string' &&
          typeof video.teacherName === 'string'
        );
      }
    );
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
    className: 'Class 7',
    section: 'A',
    rollNumber: '07',
  },

  attendance: {
    totalClasses: 120,
    present: 108,
    absent: 12,
    percentage: 90,
  },

  performance: {
    overall: 82,

    subjects: [
      {
        subject: 'Mathematics',
        score: 84,
      },
      {
        subject: 'Science',
        score: 88,
      },
      {
        subject: 'English',
        score: 78,
      },
      {
        subject: 'Social Science',
        score: 81,
      },
      {
        subject: 'Computer Science',
        score: 95,
      },
    ],

    monthly: [
      {
        month: 'Jan',
        performance: 68,
      },
      {
        month: 'Feb',
        performance: 72,
      },
      {
        month: 'Mar',
        performance: 75,
      },
      {
        month: 'Apr',
        performance: 77,
      },
      {
        month: 'May',
        performance: 82,
      },
      {
        month: 'Jun',
        performance: 86,
      },
    ],
  },

  exams: [
    {
      id: '1',
      exam: 'Unit Test 1',
      subject: 'Mathematics',
      marks: 42,
      totalMarks: 50,
      percentage: 84,
      grade: 'A',
      date: '12 Apr 2026',
    },

    {
      id: '2',
      exam: 'Mid-Term',
      subject: 'Science',
      marks: 44,
      totalMarks: 50,
      percentage: 88,
      grade: 'A+',
      date: '19 May 2026',
    },

    {
      id: '3',
      exam: 'English Quiz',
      subject: 'English',
      marks: 38,
      totalMarks: 45,
      percentage: 84,
      grade: 'A',
      date: '02 Jun 2026',
    },
  ],

  videoExplanations: [
    {
      id: 'v1',
      title: 'Fractions in Daily Life',
      subject: 'Mathematics',
      description:
        'Learn how fractions are used in shopping, cooking, and measurements.',
      videoUrl:
        'https://example.com/video/fractions',
      duration: '12 min',
      teacher: 'Ms. Ananya',
      date: 'Today',
    },

    {
      id: 'v2',
      title: 'Photosynthesis Basics',
      subject: 'Science',
      description:
        'Break down how plants make food and release oxygen.',
      videoUrl:
        'https://example.com/video/photosynthesis',
      duration: '15 min',
      teacher: 'Mr. Kamal',
      date: 'Yesterday',
    },

    {
      id: 'v3',
      title: 'Grammar Correction Tips',
      subject: 'English',
      description:
        'Quick review on sentence structure and punctuation.',
      videoUrl:
        'https://example.com/video/grammar',
      duration: '9 min',
      teacher: 'Ms. Nisha',
      date: 'Tue',
    },
  ],
};

/* =========================================================
   COMPONENT
========================================================= */

export default function StudentDashboard() {
  const [
    selectedSubject,
    setSelectedSubject,
  ] = useState(
    defaultData.performance.subjects[0]
      .subject
  );

  const [
    teacherAssessments,
    setTeacherAssessments,
  ] = useState<
    PublishedAssessment[]
  >([]);

  const [
    teacherVideos,
    setTeacherVideos,
  ] = useState<
    TeacherVideoExplanation[]
  >([]);

  /* =======================================================
     LOAD ASSESSMENTS
  ======================================================= */

  useEffect(() => {
    const syncAssessments = () => {
      setTeacherAssessments(
        readPublishedAssessments()
      );
    };

    syncAssessments();

    window.addEventListener(
      'edusense-assessments-updated',
      syncAssessments
    );

    return () => {
      window.removeEventListener(
        'edusense-assessments-updated',
        syncAssessments
      );
    };
  }, []);

  /* =======================================================
     LOAD TEACHER VIDEOS
  ======================================================= */

  useEffect(() => {
    const syncTeacherVideos = () => {
      setTeacherVideos(
        readTeacherVideos()
      );
    };

    syncTeacherVideos();

    window.addEventListener(
      TEACHER_VIDEO_UPDATED_EVENT,
      syncTeacherVideos
    );

    window.addEventListener(
      'storage',
      syncTeacherVideos
    );

    return () => {
      window.removeEventListener(
        TEACHER_VIDEO_UPDATED_EVENT,
        syncTeacherVideos
      );

      window.removeEventListener(
        'storage',
        syncTeacherVideos
      );
    };
  }, []);

  /* =======================================================
     CONVERT TEACHER VIDEOS
  ======================================================= */

  const publishedVideos =
    useMemo<VideoExplanation[]>(() => {
      return teacherVideos.map(
        (video) => ({
          id: `teacher-${video.id}`,

          title: video.title,

          subject: video.subject,

          description:
            video.description,

          videoUrl:
            video.videoUrl,

          duration:
            'Teacher upload',

          teacher:
            video.teacherName,

          date:
            new Date(
              video.createdAt
            ).toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }
            ),

          isTeacherPublished:
            true,
        })
      );
    }, [teacherVideos]);

  /* =======================================================
     COMBINE VIDEO LIBRARY
  ======================================================= */

  const videoLibrary =
    useMemo<VideoExplanation[]>(() => {
      return [
        ...publishedVideos,
        ...defaultData.videoExplanations,
      ];
    }, [publishedVideos]);

  /* =======================================================
     SELECTED SUBJECT
  ======================================================= */

  const selectedSubjectScore =
    useMemo(
      () =>
        defaultData.performance.subjects.find(
          (subject) =>
            subject.subject ===
            selectedSubject
        ) ??
        defaultData.performance.subjects[0],
      [selectedSubject]
    );

  /* =======================================================
     EXAM HISTORY
  ======================================================= */

  const examHistory =
    useMemo(() => {
      const publishedExams: ExamHistoryItem[] =
        teacherAssessments.map(
          (assessment) => ({
            id: `teacher-${assessment.id}`,

            exam:
              assessment.title,

            subject:
              assessment.subject,

            marks: 0,

            totalMarks:
              assessment.totalMarks,

            percentage: 0,

            grade: 'New',

            date:
              new Date(
                assessment.publishedAt
              ).toLocaleDateString(
                'en-GB',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }
              ),
          })
        );

      return [
        ...defaultData.exams,
        ...publishedExams,
      ];
    }, [teacherAssessments]);

  /* =======================================================
     STAT CARDS
  ======================================================= */

  const statCards = [
    {
      title: 'Overall Score',
      value: `${defaultData.performance.overall}%`,
      delta: '+6.4%',
      icon: Trophy,
      tone:
        'bg-primary/10 text-primary',
    },

    {
      title: 'Attendance',
      value: `${defaultData.attendance.percentage}%`,
      delta: '+3 days',
      icon: CheckCircle2,
      tone:
        'bg-success/10 text-success',
    },

    {
      title: 'Learning Goals',
      value: '4 / 6',
      delta: '2 on track',
      icon: Target,
      tone:
        'bg-warning/10 text-warning',
    },

    {
      title: 'Study Streak',
      value: '12 days',
      delta: 'Strong',
      icon: FlameIcon,
      tone:
        'bg-orange-500/10 text-orange-500',
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* ===================================================
          HERO
      =================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="rounded-3xl border border-border/60 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">

              <GraduationCap className="h-3.5 w-3.5" />

              Student Progress

            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {defaultData.student.name}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {defaultData.student.className}
              {' · '}
              Section {defaultData.student.section}
              {' · '}
              Roll No. {defaultData.student.rollNumber}
            </p>

          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            <div className="rounded-2xl border border-border/70 bg-card/80 p-4">

              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Attendance
              </p>

              <p className="mt-2 text-2xl font-bold text-foreground">
                {defaultData.attendance.present}/
                {defaultData.attendance.totalClasses}
              </p>

            </div>

            <div className="rounded-2xl border border-border/70 bg-card/80 p-4">

              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Next milestone
              </p>

              <p className="mt-2 text-xl font-bold text-foreground">
                Science Olympiad
              </p>

            </div>

          </div>

        </div>
      </motion.section>

      {/* ===================================================
          STATISTICS
      =================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {statCards.map(
          ({
            title,
            value,
            delta,
            icon: Icon,
            tone,
          }) => (

            <Card
              key={title}
              className="border-border/60 bg-card/80"
            >

              <CardContent className="p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {value}
                    </p>

                  </div>

                  <div
                    className={cn(
                      'rounded-xl p-2',
                      tone
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                </div>

                <p className="mt-3 text-xs text-muted-foreground">

                  <span className="font-semibold text-foreground">
                    {delta}
                  </span>

                  {' '}from last period

                </p>

              </CardContent>

            </Card>

          )
        )}

      </div>

      {/* ===================================================
          PERFORMANCE
      =================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">

        <Card className="border-border/60 bg-card/80">

          <CardHeader className="flex-row items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Monthly trend
              </p>

              <CardTitle className="mt-1 text-xl">
                Performance growth
              </CardTitle>

            </div>

            <Badge
              variant="outline"
              className="rounded-full"
            >
              +14 pts
            </Badge>

          </CardHeader>

          <CardContent className="h-72 p-4 pt-2">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  defaultData.performance.monthly
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.15)"
                />

                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  domain={[60, 100]}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#7c3aed',
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

        {/* SUBJECT FOCUS */}

        <Card className="border-border/60 bg-card/80">

          <CardHeader>

            <p className="text-sm text-muted-foreground">
              Subject focus
            </p>

            <CardTitle className="text-xl">
              Current strengths
            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-4">

            {defaultData.performance.subjects.map(
              (subject) => (

                <button
                  key={subject.subject}
                  type="button"
                  onClick={() =>
                    setSelectedSubject(
                      subject.subject
                    )
                  }
                  className={cn(
                    'w-full rounded-2xl border p-3 text-left transition-all',

                    selectedSubject ===
                      subject.subject
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border/50 bg-card'
                  )}
                >

                  <div className="flex items-center justify-between gap-3">

                    <span className="font-medium text-foreground">
                      {subject.subject}
                    </span>

                    <span className="text-sm font-semibold text-primary">
                      {subject.score}%
                    </span>

                  </div>

                  <Progress
                    value={subject.score}
                    className="mt-3 h-2"
                  />

                </button>

              )
            )}

          </CardContent>

        </Card>

      </div>

      {/* ===================================================
          EXAMS
      =================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

        <Card className="border-border/60 bg-card/80">

          <CardHeader className="flex-row items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Recent assessments
              </p>

              <CardTitle className="mt-1 text-xl">
                Exam history
              </CardTitle>

            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              View report
              <ChevronRight className="h-4 w-4" />
            </Button>

          </CardHeader>

          <CardContent className="space-y-4">

            {examHistory.map(
              (exam) => (

                <div
                  key={exam.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="font-semibold text-foreground">
                        {exam.exam}
                      </span>

                      <Badge
                        variant={
                          exam.grade ===
                          'New'
                            ? 'outline'
                            : 'secondary'
                        }
                      >
                        {exam.subject}
                      </Badge>

                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {exam.date}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="text-right">

                      <p className="text-lg font-bold text-foreground">
                        {exam.marks}/
                        {exam.totalMarks}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {exam.percentage}%
                      </p>

                    </div>

                    <Badge
                      className={cn(
                        'min-w-[3rem] justify-center rounded-full',

                        exam.grade ===
                          'New'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-success/10 text-success'
                      )}
                    >
                      {exam.grade}
                    </Badge>

                  </div>

                </div>

              )
            )}

          </CardContent>

        </Card>

        {/* STUDY SUPPORT */}

        <Card className="border-border/60 bg-card/80">

          <CardHeader>

            <p className="text-sm text-muted-foreground">
              Recommended
            </p>

            <CardTitle className="text-xl">
              Study support
            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-4">

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-primary/10 p-2 text-primary">

                  <Brain className="h-5 w-5" />

                </div>

                <div>

                  <p className="font-semibold text-foreground">
                    AI learning coach
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Focus on{' '}
                    {selectedSubjectScore.subject}
                  </p>

                </div>

              </div>

              <p className="mt-3 text-sm text-muted-foreground">

                Your current score is{' '}
                {selectedSubjectScore.score}%
                {' '}— a short revision sprint
                will improve retention before
                the next test.

              </p>

            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">

                <BookOpen className="h-5 w-5 text-primary" />

                <p className="mt-3 font-semibold text-foreground">
                  Target practice
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  12 fast exercises
                </p>

              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">

                <CalendarDays className="h-5 w-5 text-primary" />

                <p className="mt-3 font-semibold text-foreground">
                  Revision plan
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  3 sessions left
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ===================================================
          VIDEO LESSON LIBRARY
      =================================================== */}

      <Card className="border-border/60 bg-card/80">

        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Video lesson library
            </p>

            <CardTitle className="mt-1 text-xl">
              Teacher Explanations
            </CardTitle>

            {teacherVideos.length > 0 && (
              <p className="mt-1 text-xs text-success">
                {teacherVideos.length}{' '}
                teacher-published explanation
                {teacherVideos.length !== 1
                  ? 's'
                  : ''}{' '}
                available
              </p>
            )}

          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >

            <Video className="h-4 w-4" />

            Watch all

          </Button>

        </CardHeader>

        <CardContent>

          {videoLibrary.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center">

              <Video className="mx-auto h-10 w-10 text-muted-foreground" />

              <p className="mt-3 font-semibold">
                No video explanations yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your teacher's explanations
                will appear here.
              </p>

            </div>

          ) : (

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {videoLibrary.map(
                (video) => (

                  <div
                    key={video.id}
                    className={cn(
                      'rounded-2xl border p-4 transition-all hover:-translate-y-1 hover:shadow-lg',

                      video.isTeacherPublished
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border/60 bg-muted/20'
                    )}
                  >

                    {/* TOP */}

                    <div className="mb-4 flex items-center justify-between gap-2">

                      <Badge
                        variant="secondary"
                      >
                        {video.subject}
                      </Badge>

                      {video.isTeacherPublished ? (

                        <Badge className="bg-success/10 text-success border border-success/20">
                          New
                        </Badge>

                      ) : (

                        <span className="text-xs text-muted-foreground">
                          {video.date}
                        </span>

                      )}

                    </div>

                    {/* VIDEO ICON */}

                    <div className="flex items-center gap-3">

                      <div
                        className={cn(
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',

                          video.isTeacherPublished
                            ? 'bg-primary/15 text-primary'
                            : 'bg-primary/10 text-primary'
                        )}
                      >

                        <PlayCircle className="h-6 w-6" />

                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-foreground">
                          {video.title}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {video.teacher}
                        </p>

                      </div>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {video.description}
                    </p>

                    {/* DETAILS */}

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">

                      <span className="inline-flex items-center gap-1">

                        <Clock3 className="h-3.5 w-3.5" />

                        {video.duration}

                      </span>

                      <span className="inline-flex items-center gap-1">

                        <FileText className="h-3.5 w-3.5" />

                        Notes

                      </span>

                    </div>

                    {/* WATCH BUTTON */}

                    {video.videoUrl && (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 block"
                      >

                        <Button
                          type="button"
                          className="w-full gap-2"
                          variant={
                            video.isTeacherPublished
                              ? 'default'
                              : 'outline'
                          }
                        >

                          <PlayCircle className="h-4 w-4" />

                          Watch explanation

                          <ExternalLink className="ml-auto h-4 w-4" />

                        </Button>

                      </a>
                    )}

                  </div>

                )
              )}

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
}

/* =========================================================
   FLAME ICON
========================================================= */

function FlameIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >

      <path d="M12 2c1.8 2.5 3.3 4.2 3.3 6.8A3.3 3.3 0 0 1 12 12.1a3.3 3.3 0 0 1-3.3-3.3c0-2.7 1.5-4.3 3.3-6.8Z" />

      <path d="M8.5 13.5c.9 1.8 2.1 2.8 3.5 3.3 1.4-.5 2.6-1.5 3.5-3.3.5 2.6-1.1 5.2-3.5 6.2-2.4-1-4-3.6-3.5-6.2Z" />

    </svg>
  );
}