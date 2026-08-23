import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  GraduationCap,
  UserRound,
  Users,
  ArrowRight,
  Sparkles,
  Brain,
  BarChart3,
  BookOpen,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type PortalRole =
  | 'admin'
  | 'teacher'
  | 'student'
  | 'parent';

type IntroProps = {
  onContinue: () => void;
};

const portals = [
  {
    role: 'admin' as const,
    title: 'Admin Portal',
    code: 'ADMIN',
    desc: 'Manage school operations, users, classroom cameras, security and platform analytics.',
    icon: ShieldCheck,
    badgeClass: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    iconBg: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    btnClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  {
    role: 'teacher' as const,
    title: 'Teacher Portal',
    code: 'TEACHER',
    desc: 'Deploy AI quizzes, monitor classroom engagement, assign worksheets, and track student growth.',
    icon: GraduationCap,
    badgeClass: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
    iconBg: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
    btnClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  {
    role: 'student' as const,
    title: 'Student Portal',
    code: 'STUDENT',
    desc: 'Access interactive lessons, answer assignments, review evaluated solutions, and view exam reports.',
    icon: UserRound,
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    btnClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  {
    role: 'parent' as const,
    title: 'Parent Portal',
    code: 'PARENT',
    desc: 'Real-time attendance logs, assignment grades, teacher communication, and progress insights.',
    icon: Users,
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    btnClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
];

const features = [
  {
    icon: Brain,
    code: 'AI.01',
    title: 'AI Learning Tools',
    desc: 'Personalized adaptive learning and smart recommendations for students.',
  },
  {
    icon: BarChart3,
    code: 'ANALYTICS.02',
    title: 'Performance Analytics',
    desc: 'Real-time metrics for attendance, quiz progress, and subject mastery.',
  },
  {
    icon: CalendarCheck,
    code: 'ATTEND.03',
    title: 'Smart Attendance',
    desc: 'Automated attendance verification and instant notifications.',
  },
  {
    icon: BookOpen,
    code: 'CONNECT.04',
    title: 'Unified Platform',
    desc: 'Seamless collaboration between teachers, students, parents, and admins.',
  },
];

function IntroScreen({ onContinue }: IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-7 w-7" />
          </div>

          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              EDUSense
            </div>
            <p className="text-xs text-muted-foreground">
              AI Teaching & Learning Platform
            </p>
          </div>
        </motion.div>

        {/* Main intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-8 max-w-2xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Empowering modern education with AI intelligence.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            EDUSense provides automated assignment workflows, real-time analytics, and personalized learning support.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border/80 bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mt-10"
        >
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PortalSelector({
  onSelect,
}: {
  onSelect: (role: PortalRole) => void;
}) {
  const [showPortals, setShowPortals] = useState(false);

  const handleDemoLogin = (role: PortalRole) => {
    if (role === 'parent') {
      onSelect('parent');
      return;
    }

    localStorage.setItem('vidya_authenticated', 'true');
    localStorage.setItem('vidya_auth_role', role);
    localStorage.setItem('vidya_auth_name', `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`);
    localStorage.setItem('vidya_auth_user', `demo-${role}`);
    localStorage.setItem('vidya_auth_token', `demo-token-${role}`);

    window.location.reload();
  };

  return (
    <AnimatePresence mode="wait">
      {!showPortals ? (
        <IntroScreen key="intro" onContinue={() => setShowPortals(true)} />
      ) : (
        <motion.div
          key="portals"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="relative min-h-screen bg-background"
        >
          <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setShowPortals(false)}
              className="absolute left-6 top-6 flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </button>

            {/* Logo */}
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                EDUSense
              </span>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Select your portal
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose your role to log in or use the quick demo preview.
              </p>
            </div>

            {/* Portal Cards */}
            <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
              {portals.map((portal) => {
                const Icon = portal.icon;

                return (
                  <Card
                    key={portal.role}
                    className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-border hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${portal.iconBg}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${portal.badgeClass}`}>
                          {portal.code}
                        </span>
                      </div>

                      <h2 className="mt-4 text-lg font-bold text-foreground">
                        {portal.title}
                      </h2>

                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {portal.desc}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center pt-2">
                      <button
                        type="button"
                        onClick={() => onSelect(portal.role)}
                        className={`flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold transition ${portal.btnClass}`}
                      >
                        Sign In
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoLogin(portal.role)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Quick Demo
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}