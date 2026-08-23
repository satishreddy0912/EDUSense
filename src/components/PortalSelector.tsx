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
    title: 'Admin Dashboard',
    desc: 'Manage the school, users, classes, cameras and platform analytics.',
    icon: ShieldCheck,
    tone: 'primary',
  },
  {
    role: 'teacher' as const,
    title: 'Teacher Dashboard',
    desc: 'Manage lessons, quizzes, attendance and Smart Classroom Intelligence.',
    icon: GraduationCap,
    tone: 'accent',
  },
  {
    role: 'student' as const,
    title: 'Student Dashboard',
    desc: 'Access lessons, practice, performance, exams and AI learning tools.',
    icon: UserRound,
    tone: 'success',
  },
  {
    role: 'parent' as const,
    title: 'Parent Dashboard',
    desc: 'Track your child’s attendance, academics, feedback and communication.',
    icon: Users,
    tone: 'warning',
  },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    desc: 'Personalized insights for better learning outcomes.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'Understand attendance, performance and learning gaps.',
  },
  {
    icon: CalendarCheck,
    title: 'Attendance Intelligence',
    desc: 'Track attendance and identify important alerts.',
  },
  {
    icon: BookOpen,
    title: 'Connected Education',
    desc: 'One platform for students, teachers, parents and admins.',
  },
];

function IntroScreen({ onContinue }: IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.07]" />

      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />

      <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-primary">
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 3L2 9l10 6 10-6-10-6z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M2 15l10 6 10-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <div className="font-display text-4xl font-bold">
              <span className="text-gradient">EDU</span>SENSE
            </div>

            <p className="text-sm text-muted-foreground">
              Intelligent Education Platform
            </p>
          </div>
        </motion.div>

        {/* Main intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12 max-w-3xl text-center"
        >
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Education Ecosystem
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Smarter Education.
            <br />
            <span className="text-gradient">
              Better Learning Outcomes.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            EDUSense connects teachers, students, parents and school
            administrators through intelligent learning, attendance and
            performance insights.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 grid w-full max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.45 + index * 0.08,
                }}
              >
                <Card className="glass h-full p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-sm font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Continue */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="group mt-10 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          Enter EDUSense

          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </motion.button>

        <p className="mt-4 text-xs text-muted-foreground">
          Intelligent • Connected • Personalized
        </p>
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

  /*
   * Demo Login
   *
   * Admin / Teacher / Student:
   * Store a temporary demo authentication state and reload.
   *
   * Parent:
   * ParentDashboard has its own interface, so we simply open it.
   */
  const handleDemoLogin = (role: PortalRole) => {
    if (role === 'parent') {
      onSelect('parent');
      return;
    }

    localStorage.setItem('vidya_authenticated', 'true');
    localStorage.setItem('vidya_auth_role', role);
    localStorage.setItem(
      'vidya_auth_name',
      `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
    );

    localStorage.setItem(
      'vidya_auth_user',
      `demo-${role}`
    );

    localStorage.setItem(
      'vidya_auth_token',
      `demo-token-${role}`
    );

    window.location.reload();
  };

  return (
    <AnimatePresence mode="wait">
      {!showPortals ? (
        <IntroScreen
          key="intro"
          onContinue={() => setShowPortals(true)}
        />
      ) : (
        <motion.div
          key="portals"
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -60,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          className="relative min-h-screen overflow-hidden bg-background"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.07]" />

          <div className="absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />

          <div className="absolute -bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">

            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowPortals(false)}
              className="absolute left-6 top-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Intro
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-primary">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 3L2 9l10 6 10-6-10-6z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M2 15l10 6 10-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="font-display text-3xl font-bold">
                <span className="text-gradient">EDU</span>SENSE
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center"
            >
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Intelligent Education Platform
              </p>

              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                Choose your dashboard
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Select your role to continue. You can use the demo login
                for a quick preview of each dashboard.
              </p>
            </motion.div>

            {/* Portal Cards */}
            <div className="mt-10 grid w-full gap-5 sm:grid-cols-2">
              {portals.map((portal, index) => {
                const Icon = portal.icon;

                return (
                  <motion.div
                    key={portal.role}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.25 + index * 0.1,
                    }}
                  >
                    <Card className="glass group relative h-full overflow-hidden p-6 transition-all hover:border-primary/40 hover:glow-primary">

                      {/* Main portal click */}
                      <button
                        type="button"
                        onClick={() => onSelect(portal.role)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                            <Icon className="h-6 w-6" />
                          </div>

                          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>

                        <h2 className="mt-5 font-display text-xl font-semibold">
                          {portal.title}
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {portal.desc}
                        </p>
                      </button>

                      {/* Actions */}
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">

                        <button
                          type="button"
                          onClick={() => onSelect(portal.role)}
                          className="flex flex-1 items-center justify-center rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20"
                        >
                          Continue to Login
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDemoLogin(portal.role)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/10"
                        >
                          <Sparkles className="h-4 w-4" />
                          Demo Login
                        </button>

                      </div>

                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Demo note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-4 py-2 text-xs text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Demo Login is available for presentation and testing
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}