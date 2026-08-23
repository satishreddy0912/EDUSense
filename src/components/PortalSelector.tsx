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
  Terminal,
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
    code: 'SYS.ADM-01',
    desc: 'Manage school operations, users, classroom cameras, security and platform analytics.',
    icon: ShieldCheck,
    badgeClass: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,210,255,0.2)]',
    btnClass: 'bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30',
  },
  {
    role: 'teacher' as const,
    title: 'Teacher Dashboard',
    code: 'EDU.TCH-02',
    desc: 'Deploy AI quizzes, monitor classroom engagement, track lessons and review telemetry.',
    icon: GraduationCap,
    badgeClass: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
    iconBg: 'bg-pink-500/15 text-pink-400 border border-pink-500/30 shadow-[0_0_15px_rgba(255,42,133,0.2)]',
    btnClass: 'bg-pink-500/15 text-pink-300 hover:bg-pink-500/25 border border-pink-500/30',
  },
  {
    role: 'student' as const,
    title: 'Student Dashboard',
    code: 'LRN.STU-03',
    desc: 'Access interactive lessons, AI learning tools, exams, performance stats and quizzes.',
    icon: UserRound,
    badgeClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    btnClass: 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30',
  },
  {
    role: 'parent' as const,
    title: 'Parent Dashboard',
    code: 'COM.PAR-04',
    desc: 'Real-time attendance logs, assignment grades, teacher notes and student insights.',
    icon: Users,
    badgeClass: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    btnClass: 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30',
  },
];

const features = [
  {
    icon: Brain,
    code: 'MOD.01',
    title: 'AI-Powered Learning',
    desc: 'Personalized adaptive learning algorithms and tailored recommendations.',
  },
  {
    icon: BarChart3,
    code: 'MOD.02',
    title: 'Smart Analytics',
    desc: 'Precision metrics for attendance, quiz progress and knowledge retention.',
  },
  {
    icon: CalendarCheck,
    code: 'MOD.03',
    title: 'Attendance Intelligence',
    desc: 'Automated facial verification & instant multi-channel alerts.',
  },
  {
    icon: BookOpen,
    code: 'MOD.04',
    title: 'Connected Ecosystem',
    desc: 'Unified cyber platform connecting teachers, students, parents and admins.',
  },
];

function IntroScreen({ onContinue }: IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden bg-[#080b18]"
    >
      {/* Horizon Grid Background */}
      <div className="absolute inset-x-0 bottom-0 h-96 retro-grid-perspective opacity-25 pointer-events-none" />
      <div className="absolute inset-0 retro-scanlines opacity-30 pointer-events-none" />

      {/* Cyber ambient glow lights */}
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-pink-500/15 blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-400 to-pink-500 p-[1.5px] shadow-[0_0_30px_rgba(0,210,255,0.4)]">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#0e1329]">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]"
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
          </div>

          <div>
            <div className="font-display text-4xl font-extrabold tracking-wider">
              <span className="text-gradient">EDU</span>
              <span className="text-foreground">SENSE</span>
            </div>

            <p className="font-mono text-xs tracking-widest text-cyan-400/80">
              // INTELLIGENT EDUCATION PLATFORM
            </p>
          </div>
        </motion.div>

        {/* Main intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10 max-w-3xl text-center"
        >
          {/* Status Badge */}
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-cyan-500/35 bg-cyan-500/10 px-4 py-1.5 font-mono text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Terminal className="h-3.5 w-3.5" />
            SYS.ONLINE // AI_ECOSYSTEM_2026
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Smarter Education.
            <br />
            <span className="text-gradient drop-shadow-[0_0_20px_rgba(0,210,255,0.3)]">
              Better Learning Outcomes.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            EDUSense connects teachers, students, parents and school administrators
            through real-time telemetry, neural learning models, and smart classroom intelligence.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
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
                whileHover={{ y: -4 }}
              >
                <Card className="glass hud-bracket h-full p-4.5 transition-all hover:border-cyan-400/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400/70 uppercase">
                      {feature.code}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Continue CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(0, 210, 255, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="group mt-10 flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-pink-500 px-8 py-3.5 font-display text-sm font-bold text-white shadow-[0_0_25px_rgba(0,210,255,0.35)] transition"
        >
          <span>Enter EDUSense</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>

        <p className="mt-4 font-mono text-xs tracking-widest text-muted-foreground/70">
          [ Intelligent • Connected • Personalized ]
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
          className="relative min-h-screen overflow-hidden bg-[#080b18]"
        >
          {/* Background Grid */}
          <div className="absolute inset-x-0 bottom-0 h-96 retro-grid-perspective opacity-20 pointer-events-none" />
          <div className="absolute inset-0 retro-scanlines opacity-30 pointer-events-none" />

          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-pink-500/15 blur-[140px] pointer-events-none" />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">

            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowPortals(false)}
              className="absolute left-6 top-6 flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-[#0e1329]/80 px-3.5 py-2 font-mono text-xs text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(0,210,255,0.2)]"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Intro
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-pink-500 p-[1.5px] shadow-[0_0_20px_rgba(0,210,255,0.35)]">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0e1329]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-cyan-400"
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
              </div>

              <span className="font-display text-3xl font-bold tracking-wide">
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
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-cyan-400/80">
                [ Role Access Selection ]
              </p>

              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                Choose your dashboard
              </h1>

              <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted-foreground sm:text-base">
                Select your role to continue. You can use the demo login
                for a quick preview of each dashboard.
              </p>
            </motion.div>

            {/* Portal Cards */}
            <div className="mt-9 grid w-full gap-5 sm:grid-cols-2">
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
                    <Card className="glass hud-bracket group relative h-full overflow-hidden p-6 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,210,255,0.18)]">

                      {/* Main portal click */}
                      <button
                        type="button"
                        onClick={() => onSelect(portal.role)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${portal.iconBg}`}>
                            <Icon className="h-6 w-6" />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-[10px] px-2.5 py-1 rounded-md border ${portal.badgeClass}`}>
                              {portal.code}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                          </div>
                        </div>

                        <h2 className="mt-5 font-display text-xl font-bold tracking-wide text-foreground">
                          {portal.title}
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {portal.desc}
                        </p>
                      </button>

                      {/* Actions */}
                      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={() => onSelect(portal.role)}
                          className={`flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 font-display text-xs font-semibold tracking-wider transition ${portal.btnClass}`}
                        >
                          Continue to Login
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDemoLogin(portal.role)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/5 px-4 py-2.5 font-display text-xs font-semibold tracking-wider text-pink-300 transition hover:bg-pink-500/15 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(255,42,133,0.2)]"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-pink-400" />
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
              className="mt-8 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[#0e1329]/70 px-4 py-1.5 font-mono text-xs text-cyan-300 backdrop-blur shadow-[0_0_15px_rgba(0,210,255,0.1)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Demo Login is available for presentation and testing
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}