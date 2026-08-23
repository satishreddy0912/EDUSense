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
  Zap,
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
    code: 'SYS.ADM-01',
    desc: 'Manage school operations, users, classroom cameras, security policies and analytics.',
    icon: ShieldCheck,
    badgeClass: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,210,255,0.2)]',
    btnClass: 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40',
    cardHover: 'hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,210,255,0.2)]',
  },
  {
    role: 'teacher' as const,
    title: 'Teacher Portal',
    code: 'EDU.TCH-02',
    desc: 'Deploy AI quizzes, monitor classroom engagement, track assignments, and review analytics.',
    icon: GraduationCap,
    badgeClass: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
    iconBg: 'bg-pink-500/15 text-pink-400 border border-pink-500/30 shadow-[0_0_15px_rgba(255,26,117,0.2)]',
    btnClass: 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/40',
    cardHover: 'hover:border-pink-400/60 hover:shadow-[0_0_25px_rgba(255,26,117,0.2)]',
  },
  {
    role: 'student' as const,
    title: 'Student Portal',
    code: 'LRN.STU-03',
    desc: 'Answer assignments, take adaptive quizzes, review step-by-step solutions, and track study streaks.',
    icon: UserRound,
    badgeClass: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(255,183,3,0.2)]',
    btnClass: 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40',
    cardHover: 'hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,183,3,0.2)]',
  },
  {
    role: 'parent' as const,
    title: 'Parent Portal',
    code: 'COM.PAR-04',
    desc: 'Real-time attendance streams, assignment performance logs, teacher communication, and reports.',
    icon: Users,
    badgeClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    btnClass: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40',
    cardHover: 'hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
  },
];

const features = [
  {
    icon: Brain,
    code: 'MOD.01',
    title: 'Adaptive AI Engine',
    desc: 'Personalized adaptive learning paths and intelligent recommendation models.',
  },
  {
    icon: BarChart3,
    code: 'MOD.02',
    title: 'Precision Analytics',
    desc: 'Sub-second metrics for attendance, quiz progress, and conceptual mastery.',
  },
  {
    icon: CalendarCheck,
    code: 'MOD.03',
    title: 'Smart Attendance',
    desc: 'Facial verification intelligence with automated multi-channel parent alerts.',
  },
  {
    icon: BookOpen,
    code: 'MOD.04',
    title: 'Connected Matrix',
    desc: 'Unified ecosystem bridging teachers, students, parents, and administrators.',
  },
];

function IntroScreen({ onContinue }: IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen overflow-hidden bg-[#0a0e1f]"
    >
      {/* Subtle Retro Grid Horizon */}
      <div className="absolute inset-x-0 bottom-0 h-80 retro-grid-subtle opacity-20 pointer-events-none" />

      {/* Cosmic Glow Ambient Lights */}
      <div className="absolute -left-28 -top-28 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-pink-500 to-amber-400 p-[1.5px] shadow-[0_0_25px_rgba(0,210,255,0.35)]">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#0e142c]">
              <GraduationCap className="h-7 w-7 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400">
                EDU
              </span>
              <span className="text-white">SENSE</span>
            </div>
            <p className="font-mono text-xs tracking-widest text-cyan-400/80 uppercase">
              // RETRO FUSION • AI EDUCATION PLATFORM
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
          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 font-mono text-xs font-semibold text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            SYS.ONLINE // INTELLIGENT_ECOSYSTEM_2026
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Smarter Classrooms.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-pink-500 drop-shadow-[0_0_20px_rgba(0,210,255,0.25)]">
              Elevated Learning Outcomes.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            EDUSense unifies teachers, students, parents and school leadership through adaptive AI analytics,
            interactive assignment solvers, and real-time attendance intelligence.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                className="group relative rounded-2xl border border-cyan-500/20 bg-[#11172e]/85 p-5 backdrop-blur-xl transition hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,210,255,0.12)] hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400/60 font-semibold">{feature.code}</span>
                </div>

                <h3 className="mt-4 text-sm font-bold text-foreground group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-10"
        >
          <button
            type="button"
            onClick={onContinue}
            className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-pink-400 px-7 py-3.5 text-sm font-bold tracking-wide text-slate-950 shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(0,210,255,0.6)]"
          >
            <Zap className="h-4 w-4 fill-current text-slate-950" />
            <span>Enter Platform</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
          className="relative min-h-screen overflow-hidden bg-[#0a0e1f]"
        >
          {/* Subtle Retro Grid Horizon */}
          <div className="absolute inset-x-0 bottom-0 h-80 retro-grid-subtle opacity-20 pointer-events-none" />

          {/* Glow Ambient Lights */}
          <div className="absolute -left-28 -top-28 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-28 -right-28 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[140px] pointer-events-none" />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowPortals(false)}
              className="absolute left-6 top-6 flex items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-[#11172e]/80 px-3.5 py-1.5 font-mono text-xs text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </motion.button>

            {/* Logo */}
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-pink-500 to-amber-400 p-[1.5px] shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0e142c]">
                  <GraduationCap className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 font-extrabold">
                  EDU
                </span>
                <span className="text-white">SENSE</span>
              </span>
            </div>

            {/* Heading */}
            <div className="text-center">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-cyan-400/80 font-semibold">
                [ Role Selection Gateway ]
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Choose your dashboard
              </h1>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Select your role to sign in, or click Instant Demo for a live preview.
              </p>
            </div>

            {/* Portal Cards */}
            <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
              {portals.map((portal) => {
                const Icon = portal.icon;

                return (
                  <Card
                    key={portal.role}
                    className={cn(
                      'flex flex-col justify-between rounded-2xl border border-cyan-500/20 bg-[#11172e]/90 p-6 backdrop-blur-xl shadow-md transition-all duration-300 hover:-translate-y-0.5',
                      portal.cardHover
                    )}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${portal.iconBg}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={`font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${portal.badgeClass}`}>
                          {portal.code}
                        </span>
                      </div>

                      <h2 className="mt-4 text-lg font-bold text-foreground">
                        {portal.title}
                      </h2>

                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        {portal.desc}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center pt-2">
                      <button
                        type="button"
                        onClick={() => onSelect(portal.role)}
                        className={`flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition ${portal.btnClass}`}
                      >
                        Sign In
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoLogin(portal.role)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-pink-300 transition hover:bg-pink-500/20 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(255,26,117,0.2)]"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-pink-400" />
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