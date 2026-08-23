import { motion } from 'framer-motion';
import {
  School,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { useI18n } from '@/i18n';
import { adminData } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/* =========================================================
   ADMIN STATISTICS
   Smart Classroom Intelligence is intentionally NOT included
   in the Admin Dashboard.
========================================================= */

const stats = [
  {
    key: 'schools',
    label: 'Schools',
    labelTe: 'పాఠశాలలు',
    icon: School,
    value: adminData.schools,
    color: 'text-primary',
  },
  {
    key: 'teachers',
    label: 'Teachers',
    labelTe: 'ఉపాధ్యాయులు',
    icon: GraduationCap,
    value: adminData.teachers,
    color: 'text-accent',
  },
  {
    key: 'classes',
    label: 'Classes',
    labelTe: 'తరగతులు',
    icon: BookOpen,
    value: adminData.classes,
    color: 'text-success',
  },
  {
    key: 'students',
    label: 'Students',
    labelTe: 'విద్యార్థులు',
    icon: Users,
    value: adminData.students,
    color: 'text-warning',
  },
];

const pieColors = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--chart-5))',
];

/* =========================================================
   RANDOM TEACHER DATA
   Admin can see:
   - Teacher name
   - Number of classes taken
   - Attendance
========================================================= */

const teacherData = [
  {
    name: 'Anitha Rao',
    classesTaken: 28,
    attendance: 96,
  },
  {
    name: 'Ramesh Kumar',
    classesTaken: 31,
    attendance: 94,
  },
  {
    name: 'Lakshmi Devi',
    classesTaken: 26,
    attendance: 91,
  },
  {
    name: 'Suresh Babu',
    classesTaken: 34,
    attendance: 97,
  },
  {
    name: 'Priya Sharma',
    classesTaken: 29,
    attendance: 93,
  },
  {
    name: 'David Thomas',
    classesTaken: 24,
    attendance: 89,
  },
  {
    name: 'Saritha Reddy',
    classesTaken: 32,
    attendance: 95,
  },
  {
    name: 'Vijay Rao',
    classesTaken: 27,
    attendance: 88,
  },
  {
    name: 'Meena Kumari',
    classesTaken: 30,
    attendance: 92,
  },
  {
    name: 'Arjun Singh',
    classesTaken: 25,
    attendance: 90,
  },
];

export default function AdminDashboard() {
  const { t, tr } = useI18n();

  const aiUsageData = adminData.aiUsage.map((u) => ({
    name: tr(u.name),
    calls: u.calls,
  }));

  const aiDistribution = adminData.aiUsage.map((u) => ({
    name: tr(u.name),
    value: u.calls,
  }));

  return (
    <div className="min-h-screen space-y-6 pb-12">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">
            {t('nav.admin')}
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          District-level school, teacher, class and student oversight.
        </p>
      </motion.div>

      {/* =====================================================
          ADMIN STATISTICS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.key}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.08,
              }}
            >
              <Card className="glass p-5 transition hover:border-primary/40">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40">
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      stat.color
                    )}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  {tr(stat.label)}
                </div>

                <div className="font-display text-3xl font-bold">
                  {stat.value.toLocaleString()}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* =====================================================
          TEACHER OVERVIEW
      ====================================================== */}

      <Card className="glass p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-accent" />

            <h3 className="font-semibold">
              Teacher Overview
            </h3>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            View the number of classes conducted and attendance
            for each teacher.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">
                  Teacher
                </th>

                <th className="pb-3 pr-4 font-medium">
                  Classes Taken
                </th>

                <th className="pb-3 pr-4 font-medium">
                  Attendance
                </th>

                <th className="pb-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {teacherData.map((teacher) => (
                <tr
                  key={teacher.name}
                  className="border-b border-border/30 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium">
                    {teacher.name}
                  </td>

                  <td className="py-3 pr-4">
                    {teacher.classesTaken}
                  </td>

                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        'font-semibold',
                        teacher.attendance >= 90
                          ? 'text-success'
                          : 'text-warning'
                      )}
                    >
                      {teacher.attendance}%
                    </span>
                  </td>

                  <td className="py-3">
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        teacher.attendance >= 90
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      )}
                    >
                      {teacher.attendance >= 90
                        ? 'Good'
                        : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* =====================================================
          TEACHER CLASS COUNT CHART
      ====================================================== */}

      <Card className="glass p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />

            <h3 className="font-semibold">
              Classes Taken by Teachers
            </h3>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Number of classes conducted by each teacher.
          </p>
        </div>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={teacherData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 10,
              }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={70}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />

            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />

            <Bar
              dataKey="classesTaken"
              name="Classes Taken"
              fill="hsl(var(--primary))"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* =====================================================
          TEACHER ATTENDANCE CHART
      ====================================================== */}

      <Card className="glass p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-success" />

            <h3 className="font-semibold">
              Teacher Attendance
            </h3>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Attendance percentage for all teachers.
          </p>
        </div>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={teacherData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 10,
              }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={70}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />

            <Tooltip
              formatter={(value) => [
                `${value}%`,
                'Attendance',
              ]}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />

            <Bar
              dataKey="attendance"
              name="Attendance"
              fill="hsl(var(--success))"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* =====================================================
          AI USAGE ANALYTICS
          
          NOTE:
          This is general platform AI usage analytics.
          Smart Classroom Intelligence is NOT shown here.
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        <Card className="glass p-6 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold">
              AI Feature Usage
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Platform-wide AI feature usage statistics.
            </p>
          </div>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <BarChart
              data={aiUsageData}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />

              <XAxis
                type="number"
                tick={{
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 11,
                }}
              />

              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 11,
                }}
                width={120}
              />

              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />

              <Bar
                dataKey="calls"
                radius={[0, 8, 8, 0]}
              >
                {aiUsageData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      pieColors[
                        i % pieColors.length
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6">
          <h3 className="mb-4 font-semibold">
            Usage Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <PieChart>
              <Pie
                data={aiDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
              >
                {aiDistribution.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      pieColors[
                        i % pieColors.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: '11px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* =====================================================
          RECENT REPORTS
      ====================================================== */}

      <Card className="glass p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />

          <h3 className="font-semibold">
            Recent Reports
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">
                  School
                </th>

                <th className="pb-3 pr-4 font-medium">
                  Teacher
                </th>

                <th className="pb-3 pr-4 font-medium">
                  Lesson
                </th>

                <th className="pb-3 pr-4 font-medium">
                  Gaps
                </th>

                <th className="pb-3 pr-4 font-medium">
                  Improvement
                </th>

                <th className="pb-3 font-medium">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {[
                {
                  school: 'ZPHS Racharla',
                  teacher: 'Lakshmi',
                  lesson: 'Fractions',
                  gaps: 1,
                  improvement: '+48%',
                  date: 'Aug 22',
                },
                {
                  school: 'DAV Urban',
                  teacher: 'Ramesh',
                  lesson: 'Decimals',
                  gaps: 0,
                  improvement: '+22%',
                  date: 'Aug 21',
                },
                {
                  school: 'Govt High Mahabubnagar',
                  teacher: 'Saritha',
                  lesson: 'Photosynthesis',
                  gaps: 2,
                  improvement: '+35%',
                  date: 'Aug 20',
                },
                {
                  school: 'Kendriya Vidyalaya',
                  teacher: 'David',
                  lesson: 'Algebra Basics',
                  gaps: 1,
                  improvement: '+30%',
                  date: 'Aug 19',
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border/30 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium">
                    {row.school}
                  </td>

                  <td className="py-3 pr-4 text-muted-foreground">
                    {row.teacher}
                  </td>

                  <td className="py-3 pr-4">
                    {row.lesson}
                  </td>

                  <td className="py-3 pr-4">
                    <span
                      className={
                        row.gaps > 0
                          ? 'text-warning'
                          : 'text-success'
                      }
                    >
                      {row.gaps}
                    </span>
                  </td>

                  <td className="py-3 pr-4 font-semibold text-success">
                    {row.improvement}
                  </td>

                  <td className="py-3 text-muted-foreground">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}