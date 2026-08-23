import { motion } from 'framer-motion';
import {
  Home,
  Trees,
  Building2,
  GraduationCap,
  User,
  Settings,
  Brain,
  Users,
  ScanFace,
  LogOut,
  Terminal,
  Activity,
  Cpu,
} from 'lucide-react';

import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import LanguageSelector from '@/components/shared/LanguageSelector';

export type View =
  | 'home'
  | 'rural'
  | 'urban'
  | 'teacher'
  | 'student'
  | 'admin'
  | 'quiz'
  | 'parent'
  | 'attendance';

interface NavItem {
  id: View;
  labelKey: string;
  code: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  {
    id: 'teacher',
    labelKey: 'nav.teacher',
    code: 'TCH.01',
    icon: GraduationCap,
  },
  {
    id: 'urban',
    labelKey: 'nav.urban',
    code: 'URB.02',
    icon: Building2,
  },
  {
    id: 'rural',
    labelKey: 'nav.rural',
    code: 'RUR.03',
    icon: Trees,
  },
  {
    id: 'quiz',
    labelKey: 'nav.quiz',
    code: 'QZ.AI',
    icon: Brain,
  },
  {
    id: 'attendance',
    labelKey: 'nav.attendance',
    code: 'ATD.05',
    icon: ScanFace,
  },
  {
    id: 'student',
    labelKey: 'nav.student',
    code: 'STU.06',
    icon: User,
  },
  {
    id: 'parent',
    labelKey: 'nav.parent',
    code: 'PAR.07',
    icon: Users,
  },
  {
    id: 'admin',
    labelKey: 'nav.admin',
    code: 'ADM.SYS',
    icon: Settings,
  },
];

export default function Sidebar({
  view,
  onView,
  role,
  onLogout,
}: {
  view: View;
  onView: (v: View) => void;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  onLogout: () => void;
}) {
  const { t } = useI18n();

  const visibleItems = navItems.filter((item) => {
    if (role === 'admin') {
      return ['admin', 'attendance', 'urban'].includes(item.id);
    }

    if (role === 'student') {
      return ['student'].includes(item.id);
    }

    if (role === 'parent') {
      return ['parent'].includes(item.id);
    }

    if (role === 'teacher') {
      return [
        'teacher',
        'urban',
        'rural',
        'quiz',
        'attendance',
      ].includes(item.id);
    }

    return false;
  });

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-20 flex-col items-center border-r border-cyan-500/25 bg-[#050814]/95 backdrop-blur-2xl shadow-[4px_0_35px_rgba(0,0,0,0.8)] lg:w-64">
      {/* Top Corner HUD Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 shadow-[0_0_10px_#00f0ff]" />

      {/* Logo */}
      <button
        type="button"
        onClick={() => onView('home')}
        className="mt-6 flex items-center gap-3 lg:px-4 group"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-yellow-400 to-pink-500 p-[1.5px] shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-transform group-hover:scale-105">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#090d22]">
            <Cpu className="h-6 w-6 text-cyan-400 filter drop-shadow-[0_0_6px_#00f0ff]" />
          </div>
        </div>

        <div className="hidden text-left lg:block">
          <span className="font-display text-lg font-black tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-yellow-300 to-pink-500">
              EDU
            </span>
            <span className="text-white">SENSE</span>
          </span>
          <p className="font-mono text-[9px] tracking-widest text-cyan-400/80 uppercase">
            // CYBERNET.2077
          </p>
        </div>
      </button>

      {/* Role Pill */}
      <div className="hidden lg:flex mt-4 w-[calc(100%-2rem)] items-center justify-between px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 font-mono text-[10px] text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
        <span className="flex items-center gap-1.5 uppercase font-bold">
          <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#ffe600] animate-pulse"></span>
          ACCESS: {role}
        </span>
        <Terminal className="h-3.5 w-3.5 text-cyan-400" />
      </div>

      {/* Navigation Items */}
      <nav className="mt-5 flex flex-1 w-full flex-col gap-1.5 overflow-y-auto px-2 scrollbar-hide lg:px-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onView(item.id)}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all',
                active
                  ? 'text-slate-950 font-bold'
                  : 'text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-300'
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-yellow-300 shadow-[0_0_25px_rgba(0,240,255,0.6)]"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <Icon
                className={cn(
                  'relative h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110',
                  active ? 'text-slate-950 font-bold' : 'text-cyan-400/80 group-hover:text-cyan-300'
                )}
              />

              <span className="relative hidden lg:inline font-sans text-xs">
                {t(item.labelKey)}
              </span>

              <span
                className={cn(
                  'relative ml-auto hidden font-mono text-[9px] lg:inline',
                  active ? 'text-slate-950 font-black' : 'text-cyan-400/40'
                )}
              >
                {item.code}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Telemetry Status Line */}
      <div className="hidden lg:flex w-[calc(100%-2rem)] items-center justify-between py-2 border-t border-border/40 text-[9px] font-mono text-muted-foreground/70">
        <span className="flex items-center gap-1 text-emerald-400">
          <Activity className="h-3 w-3 animate-pulse" />
          SYS.ONLINE
        </span>
        <span className="text-cyan-400/80">LATENCY: 12ms</span>
      </div>

      {/* Bottom actions */}
      <div className="mb-4 flex w-full flex-col items-center gap-2 px-2 lg:px-3">
        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2 font-mono text-xs text-pink-300 transition hover:border-pink-500/60 hover:bg-pink-500/20 hover:shadow-[0_0_20px_rgba(255,0,85,0.3)] lg:justify-start"
        >
          <LogOut className="h-4 w-4 shrink-0 text-pink-400" />
          <span className="hidden lg:inline uppercase font-bold tracking-wider">
            TERMINATE SESSION
          </span>
        </button>

        <LanguageSelector />
      </div>
    </aside>
  );
}