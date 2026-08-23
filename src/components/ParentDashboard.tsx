import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Brain,
  Clock3,
  ChevronRight,
  User,
  GraduationCap,
  Bell,
  Target,
  ClipboardCheck,
  Award,
  FileText,
} from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
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

type SubjectAttendance = {
  subject: string;
  total: number;
  present: number;
  absent: number;
  percentage: number;
};

type MonthlyAttendance = {
  month: string;
  attendance: number;
};

type Assignment = {
  id: number;
  subject: string;
  topic: string;
  title: string;
  marks: number;
  totalMarks: number;
  date: string;
};

type Assessment = {
  subject: string;
  test: string;
  score: number;
  total: number;
  date: string;
};

type AssignmentTrend = {
  date: string;
  percentage: number;
};

type ParentData = {
  student: {
    name: string;
    className: string;
    section: string;
    rollNumber: string;
    attendance: number;
    overallPerformance: number;
  };

  attendance: {
    totalClasses: number;
    present: number;
    absent: number;
    percentage: number;
    subjects: SubjectAttendance[];
    monthly: MonthlyAttendance[];
  };

  assignments: Assignment[];

  assignmentTrend: AssignmentTrend[];

  assessments: Assessment[];

  insights: {
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }[];
};

const defaultData: ParentData = {
  student: {
    name: 'Aarav Reddy',
    className: 'Class 7',
    section: 'A',
    rollNumber: '07',
    attendance: 90,
    overallPerformance: 82,
  },

  attendance: {
    totalClasses: 120,
    present: 108,
    absent: 12,
    percentage: 90,

    subjects: [
      {
        subject: 'Mathematics',
        total: 24,
        present: 22,
        absent: 2,
        percentage: 92,
      },
      {
        subject: 'Science',
        total: 24,
        present: 21,
        absent: 3,
        percentage: 88,
      },
      {
        subject: 'English',
        total: 20,
        present: 17,
        absent: 3,
        percentage: 85,
      },
      {
        subject: 'Social Science',
        total: 20,
        present: 18,
        absent: 2,
        percentage: 90,
      },
      {
        subject: 'Computer Science',
        total: 20,
        present: 19,
        absent: 1,
        percentage: 95,
      },
    ],

    monthly: [
      { month: 'Jan', attendance: 88 },
      { month: 'Feb', attendance: 90 },
      { month: 'Mar', attendance: 87 },
      { month: 'Apr', attendance: 92 },
      { month: 'May', attendance: 89 },
      { month: 'Jun', attendance: 91 },
      { month: 'Jul', attendance: 93 },
      { month: 'Aug', attendance: 90 },
      { month: 'Sep', attendance: 94 },
      { month: 'Oct', attendance: 92 },
      { month: 'Nov', attendance: 95 },
      { month: 'Dec', attendance: 94 },
    ],
  },

  /*
   * =========================================================
   * ASSIGNMENTS
   * Every assignment contains:
   * - Subject
   * - Assignment title
   * - Topic
   * - Marks obtained
   * - Total marks
   * - Date
   * =========================================================
   */
  assignments: [
    {
      id: 1,
      subject: 'Mathematics',
      title: 'Fractions Worksheet',
      topic: 'Adding and Subtracting Fractions',
      marks: 18,
      totalMarks: 20,
      date: '20 Aug 2026',
    },
    {
      id: 2,
      subject: 'Science',
      title: 'Light Assignment',
      topic: 'Reflection of Light',
      marks: 17,
      totalMarks: 20,
      date: '19 Aug 2026',
    },
    {
      id: 3,
      subject: 'English',
      title: 'Grammar Practice',
      topic: 'Tenses and Sentence Formation',
      marks: 16,
      totalMarks: 20,
      date: '18 Aug 2026',
    },
    {
      id: 4,
      subject: 'Social Science',
      title: 'History Worksheet',
      topic: 'The Mughal Empire',
      marks: 15,
      totalMarks: 20,
      date: '17 Aug 2026',
    },
    {
      id: 5,
      subject: 'Computer Science',
      title: 'Programming Exercise',
      topic: 'Variables and Data Types',
      marks: 19,
      totalMarks: 20,
      date: '16 Aug 2026',
    },
    {
      id: 6,
      subject: 'Mathematics',
      title: 'Algebra Practice',
      topic: 'Simple Linear Equations',
      marks: 14,
      totalMarks: 20,
      date: '14 Aug 2026',
    },
    {
      id: 7,
      subject: 'Science',
      title: 'Sound Worksheet',
      topic: 'Production and Propagation of Sound',
      marks: 18,
      totalMarks: 20,
      date: '13 Aug 2026',
    },
    {
      id: 8,
      subject: 'English',
      title: 'Writing Assignment',
      topic: 'Descriptive Paragraph Writing',
      marks: 17,
      totalMarks: 20,
      date: '12 Aug 2026',
    },
    {
      id: 9,
      subject: 'Social Science',
      title: 'Geography Assignment',
      topic: 'Resources and Their Distribution',
      marks: 16,
      totalMarks: 20,
      date: '10 Aug 2026',
    },
    {
      id: 10,
      subject: 'Computer Science',
      title: 'Logic Building',
      topic: 'Conditional Statements',
      marks: 18,
      totalMarks: 20,
      date: '09 Aug 2026',
    },
    {
      id: 11,
      subject: 'Mathematics',
      title: 'Geometry Worksheet',
      topic: 'Lines and Angles',
      marks: 17,
      totalMarks: 20,
      date: '07 Aug 2026',
    },
    {
      id: 12,
      subject: 'Science',
      title: 'Physics Activity',
      topic: 'Force and Motion',
      marks: 16,
      totalMarks: 20,
      date: '05 Aug 2026',
    },
  ],

  assignmentTrend: [
    {
      date: '05 Aug',
      percentage: 80,
    },
    {
      date: '07 Aug',
      percentage: 85,
    },
    {
      date: '09 Aug',
      percentage: 90,
    },
    {
      date: '10 Aug',
      percentage: 80,
    },
    {
      date: '12 Aug',
      percentage: 85,
    },
    {
      date: '13 Aug',
      percentage: 90,
    },
    {
      date: '14 Aug',
      percentage: 70,
    },
    {
      date: '16 Aug',
      percentage: 95,
    },
    {
      date: '17 Aug',
      percentage: 75,
    },
    {
      date: '18 Aug',
      percentage: 80,
    },
    {
      date: '19 Aug',
      percentage: 85,
    },
    {
      date: '20 Aug',
      percentage: 90,
    },
  ],

  assessments: [
    {
      subject: 'Mathematics',
      test: 'Fractions Assessment',
      score: 42,
      total: 50,
      date: '18 Aug 2026',
    },
    {
      subject: 'Science',
      test: 'Light & Sound',
      score: 44,
      total: 50,
      date: '14 Aug 2026',
    },
    {
      subject: 'English',
      test: 'Grammar Assessment',
      score: 38,
      total: 50,
      date: '11 Aug 2026',
    },
    {
      subject: 'Computer Science',
      test: 'Programming Basics',
      score: 47,
      total: 50,
      date: '08 Aug 2026',
    },
  ],

  insights: [
    {
      title: 'Strong overall progress',
      description:
        'Your child is maintaining an overall academic performance of 82%.',
      type: 'success',
    },
    {
      title: 'Fractions need some revision',
      description:
        'Recent Mathematics responses suggest that fractions may need additional practice.',
      type: 'warning',
    },
    {
      title: 'Attendance is healthy',
      description:
        'Current attendance is 90%, which is comfortably above the 75% minimum.',
      type: 'info',
    },
  ],
};

function getScorePercentage(
  score: number,
  total: number
) {
  if (!total) return 0;

  return Math.round(
    (score / total) * 100
  );
}

function getAttendanceStatus(
  percentage: number
) {
  if (percentage < 75) {
    return {
      label: 'Action Required',
      className:
        'bg-destructive/10 text-destructive border-destructive/20',
    };
  }

  if (percentage < 85) {
    return {
      label: 'Needs Attention',
      className:
        'bg-warning/10 text-warning border-warning/20',
    };
  }

  return {
    label: 'Good',
    className:
      'bg-success/10 text-success border-success/20',
  };
}

function getAssignmentStatus(
  percentage: number
) {
  if (percentage >= 90) {
    return {
      label: 'Excellent',
      className:
        'border-success/30 bg-success/10 text-success',
    };
  }

  if (percentage >= 75) {
    return {
      label: 'Good',
      className:
        'border-primary/30 bg-primary/10 text-primary',
    };
  }

  if (percentage >= 60) {
    return {
      label: 'Needs Practice',
      className:
        'border-warning/30 bg-warning/10 text-warning',
    };
  }

  return {
    label: 'Needs Attention',
    className:
      'border-destructive/30 bg-destructive/10 text-destructive',
  };
}

export default function ParentDashboard() {
  const [data] = useState<ParentData>(
    defaultData
  );

  const [showAllSubjects, setShowAllSubjects] =
    useState(false);

  const [showAllAssignments, setShowAllAssignments] =
    useState(false);

  const attendanceStatus =
    getAttendanceStatus(
      data.attendance.percentage
    );

  const displayedSubjects = useMemo(() => {
    if (showAllSubjects) {
      return data.attendance.subjects;
    }

    return data.attendance.subjects.slice(0, 4);
  }, [
    data.attendance.subjects,
    showAllSubjects,
  ]);

  const assignmentSummary = useMemo(() => {
    const totalMarks = data.assignments.reduce(
      (sum, assignment) =>
        sum + assignment.totalMarks,
      0
    );

    const obtainedMarks = data.assignments.reduce(
      (sum, assignment) =>
        sum + assignment.marks,
      0
    );

    const percentage = totalMarks
      ? Math.round(
          (obtainedMarks / totalMarks) * 100
        )
      : 0;

    return {
      totalAssignments:
        data.assignments.length,
      totalMarks,
      obtainedMarks,
      percentage,
    };
  }, [data.assignments]);

  const subjectAssignmentPerformance =
    useMemo(() => {
      const grouped: Record<
        string,
        {
          subject: string;
          obtained: number;
          total: number;
        }
      > = {};

      data.assignments.forEach(
        (assignment) => {
          if (!grouped[assignment.subject]) {
            grouped[assignment.subject] = {
              subject: assignment.subject,
              obtained: 0,
              total: 0,
            };
          }

          grouped[assignment.subject].obtained +=
            assignment.marks;

          grouped[assignment.subject].total +=
            assignment.totalMarks;
        }
      );

      return Object.values(grouped).map(
        (item) => ({
          subject: item.subject,
          percentage: item.total
            ? Math.round(
                (item.obtained / item.total) * 100
              )
            : 0,
        })
      );
    }, [data.assignments]);

  const displayedAssignments =
    showAllAssignments
      ? data.assignments
      : data.assignments.slice(0, 6);

  return (
    <div className="min-h-screen space-y-6 pb-12">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.header
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Parent Portal
            </span>

            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              2026–27
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Parent Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track your child's attendance, assignments,
            marks and academic progress.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Parent Account
            </p>

            <p className="text-xs text-muted-foreground">
              Linked to {data.student.name}
            </p>
          </div>
        </div>
      </motion.header>

      {/* =====================================================
          STUDENT PROFILE
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <Card className="glass overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Student
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {data.student.name}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {data.student.className} • Section{' '}
                    {data.student.section} • Roll No.{' '}
                    {data.student.rollNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
                <div className="rounded-xl bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">
                    Overall Performance
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {data.student.overallPerformance}%
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-4">
                  <p className="text-xs text-muted-foreground">
                    Attendance
                  </p>

                  <p className="mt-1 text-2xl font-bold text-primary">
                    {data.student.attendance}%
                  </p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* =====================================================
          QUICK SUMMARY
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        {[
          {
            title: 'Attendance',
            value: `${data.attendance.percentage}%`,
            subtitle: `${data.attendance.present} classes present`,
            icon: CalendarDays,
            tone: 'primary',
          },
          {
            title: 'Assignments',
            value: assignmentSummary.totalAssignments,
            subtitle: 'completed assignments',
            icon: ClipboardCheck,
            tone: 'accent',
          },
          {
            title: 'Assignment Average',
            value: `${assignmentSummary.percentage}%`,
            subtitle: `${assignmentSummary.obtainedMarks}/${assignmentSummary.totalMarks} marks`,
            icon: Award,
            tone: 'success',
          },
          {
            title: 'Absent',
            value: data.attendance.absent,
            subtitle: 'classes missed',
            icon: XCircle,
            tone: 'destructive',
          },
          {
            title: 'Performance',
            value: `${data.student.overallPerformance}%`,
            subtitle: 'overall academic score',
            icon: TrendingUp,
            tone: 'accent',
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                y: -3,
              }}
            >
              <Card className="glass h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {item.title}
                      </p>

                      <p className="mt-2 text-3xl font-bold">
                        {item.value}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.subtitle}
                      </p>
                    </div>

                    <div
                      className={cn(
                        'rounded-xl p-2.5',
                        item.tone === 'primary' &&
                          'bg-primary/10 text-primary',
                        item.tone === 'success' &&
                          'bg-success/10 text-success',
                        item.tone === 'destructive' &&
                          'bg-destructive/10 text-destructive',
                        item.tone === 'accent' &&
                          'bg-accent/10 text-accent'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

      </div>

      {/* =====================================================
          ASSIGNMENT PROGRESS
      ====================================================== */}

      <Card className="glass overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-accent" />
                Assignment Progress
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                View every assignment, topic and marks
                scored by your child.
              </p>
            </div>

            <Badge
              variant="outline"
              className="w-fit border-primary/30 bg-primary/10 text-primary"
            >
              {assignmentSummary.totalAssignments}{' '}
              Assignments
            </Badge>
          </div>
        </CardHeader>

        <CardContent>

          {/* Assignment summary */}

          <div className="mb-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-border/50 bg-muted/20 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Assignments
                  </p>

                  <p className="text-2xl font-bold">
                    {assignmentSummary.totalAssignments}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-muted/20 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-success/10 p-2.5">
                  <Award className="h-5 w-5 text-success" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Marks Obtained
                  </p>

                  <p className="text-2xl font-bold">
                    {assignmentSummary.obtainedMarks}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">
                      / {assignmentSummary.totalMarks}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-muted/20 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-accent/10 p-2.5">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Assignment Average
                  </p>

                  <p className="text-2xl font-bold">
                    {assignmentSummary.percentage}%
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Assignment list */}

          <div className="space-y-3">

            {displayedAssignments.map(
              (assignment, index) => {
                const percentage =
                  getScorePercentage(
                    assignment.marks,
                    assignment.totalMarks
                  );

                const status =
                  getAssignmentStatus(
                    percentage
                  );

                return (
                  <motion.div
                    key={assignment.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.04,
                    }}
                    className="rounded-2xl border border-border/50 bg-muted/10 p-4 transition hover:border-primary/30 hover:bg-muted/20"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                      {/* Assignment information */}

                      <div className="flex min-w-0 flex-1 items-start gap-3">

                        <div className="rounded-xl bg-primary/10 p-2.5">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">
                              {assignment.title}
                            </p>

                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {assignment.subject}
                            </Badge>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Topic:{' '}
                            <span className="font-medium text-foreground/80">
                              {assignment.topic}
                            </span>
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Submitted / evaluated on{' '}
                            {assignment.date}
                          </p>

                        </div>
                      </div>

                      {/* Marks */}

                      <div className="flex items-center gap-5 lg:min-w-[330px]">

                        <div className="min-w-[90px] text-right">
                          <p className="text-xs text-muted-foreground">
                            Marks
                          </p>

                          <p className="text-xl font-bold">
                            {assignment.marks}
                            <span className="text-sm font-medium text-muted-foreground">
                              /{assignment.totalMarks}
                            </span>
                          </p>
                        </div>

                        <div className="min-w-[130px] flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Score
                            </span>

                            <span className="text-xs font-semibold">
                              {percentage}%
                            </span>
                          </div>

                          <Progress
                            value={percentage}
                            className="h-2"
                          />
                        </div>

                        <Badge
                          variant="outline"
                          className={cn(
                            'hidden sm:inline-flex',
                            status.className
                          )}
                        >
                          {status.label}
                        </Badge>

                      </div>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

          {data.assignments.length > 6 && (
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() =>
                setShowAllAssignments(
                  (previous) => !previous
                )
              }
            >
              {showAllAssignments
                ? 'Show Less'
                : `View All ${data.assignments.length} Assignments`}

              <ChevronRight
                className={cn(
                  'ml-1 h-4 w-4 transition-transform',
                  showAllAssignments &&
                    'rotate-90'
                )}
              />
            </Button>
          )}

        </CardContent>
      </Card>

      {/* =====================================================
          ASSIGNMENT PERFORMANCE BY SUBJECT
      ====================================================== */}

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Assignment Performance by Subject
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Average assignment performance across each
            subject.
          </p>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            {subjectAssignmentPerformance.map(
              (subject) => {
                const status =
                  getAssignmentStatus(
                    subject.percentage
                  );

                return (
                  <div
                    key={subject.subject}
                    className="rounded-xl border border-border/50 bg-muted/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          {subject.subject}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Assignment average
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={status.className}
                      >
                        {subject.percentage}%
                      </Badge>
                    </div>

                    <Progress
                      value={subject.percentage}
                      className="mt-3 h-2"
                    />
                  </div>
                );
              }
            )}

          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          ASSIGNMENT PERFORMANCE TREND
      ====================================================== */}

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Assignment Performance Trend
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Track how your child's assignment scores are
            changing over time.
          </p>
        </CardHeader>

        <CardContent>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={data.assignmentTrend}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                />

                <YAxis
                  domain={[50, 100]}
                  tick={{
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                  tickFormatter={(value) =>
                    `${value}%`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    'Assignment Score',
                  ]}
                  contentStyle={{
                    background:
                      'hsl(var(--card))',
                    border:
                      '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          ATTENDANCE OVERVIEW
      ====================================================== */}

      <Card className="glass overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Attendance Overview
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Your child's current attendance status.
              </p>
            </div>

            <Badge
              variant="outline"
              className={cn(
                'w-fit',
                attendanceStatus.className
              )}
            >
              {attendanceStatus.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

            <div>

              <div className="mb-2 flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Overall attendance
                  </p>

                  <p className="mt-1 text-4xl font-bold">
                    {data.attendance.percentage}%
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Required minimum
                  </p>

                  <p className="font-semibold">
                    75%
                  </p>
                </div>
              </div>

              <Progress
                value={data.attendance.percentage}
                className="h-3"
              />

              <div className="mt-4 grid grid-cols-3 gap-3">

                <div className="rounded-xl bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">
                    Conducted
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {data.attendance.totalClasses}
                  </p>
                </div>

                <div className="rounded-xl bg-success/10 p-3">
                  <p className="text-xs text-success">
                    Present
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {data.attendance.present}
                  </p>
                </div>

                <div className="rounded-xl bg-destructive/10 p-3">
                  <p className="text-xs text-destructive">
                    Absent
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {data.attendance.absent}
                  </p>
                </div>

              </div>
            </div>

            <div
              className={cn(
                'rounded-2xl border p-5',
                data.attendance.percentage < 75
                  ? 'border-destructive/30 bg-destructive/5'
                  : 'border-success/30 bg-success/5'
              )}
            >
              {data.attendance.percentage < 75 ? (
                <AlertTriangle className="h-7 w-7 text-destructive" />
              ) : (
                <CheckCircle2 className="h-7 w-7 text-success" />
              )}

              <h3 className="mt-3 font-semibold">
                {data.attendance.percentage < 75
                  ? 'Attendance needs attention'
                  : 'Attendance is healthy'}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {data.attendance.percentage < 75
                  ? `Attendance is currently ${data.attendance.percentage}%. Please monitor upcoming classes to bring it above the required 75%.`
                  : `Your child's attendance is ${data.attendance.percentage}%, which is above the required 75% minimum.`}
              </p>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          MONTHLY ATTENDANCE TREND
      ====================================================== */}

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Monthly Attendance Trend
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={data.attendance.monthly}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                />

                <YAxis
                  domain={[70, 100]}
                  tick={{
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                  tickFormatter={(value) =>
                    `${value}%`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    'Attendance',
                  ]}
                  contentStyle={{
                    background:
                      'hsl(var(--card))',
                    border:
                      '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          SUBJECT-WISE ATTENDANCE
      ====================================================== */}

      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Subject-wise Attendance
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Attendance across your child's subjects.
              </p>
            </div>

            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            {displayedSubjects.map(
              (subject) => {
                const status =
                  getAttendanceStatus(
                    subject.percentage
                  );

                return (
                  <div
                    key={subject.subject}
                    className="rounded-xl border border-border/50 bg-muted/10 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-3">

                          <p className="truncate text-sm font-semibold">
                            {subject.subject}
                          </p>

                          <span className="text-sm font-bold">
                            {subject.percentage}%
                          </span>

                        </div>

                        <div className="mt-2">
                          <Progress
                            value={subject.percentage}
                            className="h-2"
                          />
                        </div>

                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">

                        <span>
                          {subject.present} present
                        </span>

                        <span>
                          {subject.absent} absent
                        </span>

                        <Badge
                          variant="outline"
                          className={cn(
                            'hidden sm:inline-flex',
                            status.className
                          )}
                        >
                          {status.label}
                        </Badge>

                      </div>

                    </div>
                  </div>
                );
              }
            )}

          </div>

          {data.attendance.subjects.length > 4 && (
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() =>
                setShowAllSubjects(
                  (previous) => !previous
                )
              }
            >
              {showAllSubjects
                ? 'Show Less'
                : 'View All Subjects'}

              <ChevronRight
                className={cn(
                  'ml-1 h-4 w-4 transition-transform',
                  showAllSubjects &&
                    'rotate-90'
                )}
              />
            </Button>
          )}

        </CardContent>
      </Card>

      {/* =====================================================
          ATTENDANCE COMPARISON
      ====================================================== */}

      <Card className="glass">
        <CardHeader>
          <CardTitle>
            Subject Attendance Comparison
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={data.attendance.subjects}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />

                <XAxis
                  dataKey="subject"
                  tick={{
                    fontSize: 10,
                  }}
                  interval={0}
                />

                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) =>
                    `${value}%`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    'Attendance',
                  ]}
                  contentStyle={{
                    background:
                      'hsl(var(--card))',
                    border:
                      '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />

                <Bar
                  dataKey="percentage"
                  fill="hsl(var(--accent))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          AI LEARNING INSIGHTS
      ====================================================== */}

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            EduSense Learning Insights
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Helpful updates based on learning and assessment
            evidence.
          </p>
        </CardHeader>

        <CardContent>

          <div className="grid gap-4 md:grid-cols-3">

            {data.insights.map(
              (insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className={cn(
                    'rounded-2xl border p-5',
                    insight.type === 'success' &&
                      'border-success/20 bg-success/5',
                    insight.type === 'warning' &&
                      'border-warning/20 bg-warning/5',
                    insight.type === 'info' &&
                      'border-primary/20 bg-primary/5'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      insight.type === 'success' &&
                        'bg-success/10 text-success',
                      insight.type === 'warning' &&
                        'bg-warning/10 text-warning',
                      insight.type === 'info' &&
                        'bg-primary/10 text-primary'
                    )}
                  >
                    {insight.type === 'success' && (
                      <CheckCircle2 className="h-5 w-5" />
                    )}

                    {insight.type === 'warning' && (
                      <AlertTriangle className="h-5 w-5" />
                    )}

                    {insight.type === 'info' && (
                      <Brain className="h-5 w-5" />
                    )}
                  </div>

                  <h3 className="mt-4 font-semibold">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {insight.description}
                  </p>
                </motion.div>
              )
            )}

          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          RECENT ASSESSMENTS
      ====================================================== */}

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Recent Assessments
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="space-y-3">

            {data.assessments.map(
              (assessment) => {
                const percentage =
                  getScorePercentage(
                    assessment.score,
                    assessment.total
                  );

                return (
                  <div
                    key={`${assessment.subject}-${assessment.test}`}
                    className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/10 p-4 sm:flex-row sm:items-center"
                  >

                    <div className="flex flex-1 items-center gap-3">

                      <div className="rounded-xl bg-primary/10 p-2.5">
                        <Target className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-medium">
                          {assessment.test}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {assessment.subject} •{' '}
                          {assessment.date}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-4">

                      <div className="text-right">

                        <p className="text-lg font-bold">
                          {assessment.score}/
                          {assessment.total}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {percentage}%
                        </p>

                      </div>

                      <Badge
                        variant="outline"
                        className={cn(
                          percentage >= 85
                            ? 'border-success/30 bg-success/10 text-success'
                            : percentage >= 75
                              ? 'border-primary/30 bg-primary/10 text-primary'
                              : 'border-warning/30 bg-warning/10 text-warning'
                        )}
                      >
                        {percentage >= 85
                          ? 'Excellent'
                          : percentage >= 75
                            ? 'Good'
                            : 'Practice'}
                      </Badge>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          PARENT NOTIFICATION
      ====================================================== */}

      <Card className="glass border-primary/20">
        <CardContent className="p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1">

              <h3 className="font-semibold">
                Stay informed, not overwhelmed
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                EduSense keeps parents informed about
                attendance, assignment marks, assessment
                performance and areas where additional
                learning support may help.
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              Updated recently
            </div>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}