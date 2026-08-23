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
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-20 flex-col items-center border-r border-cyan-500/20 bg-[#090d22]/90 backdrop-blur-2xl shadow-[4px_0_30px_rgba(0,0,0,0.6)] lg:w-64">

      {/* Logo */}
      <button
        type="button"
        onClick={() => onView('home')}
        className="mt-6 flex items-center gap-3 lg:px-4 group"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-pink-500 p-[1px] shadow-[0_0_15px_rgba(0,210,255,0.35)] transition-transform group-hover:scale-105">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0e1329]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-cyan-400"
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

        <div className="hidden text-left lg:block">
          <span className="font-display text-base font-extrabold tracking-wider">
            <span className="text-gradient">EDU</span>
            <span className="text-foreground">SENSE</span>
          </span>
          <p className="font-mono text-[9px] tracking-widest text-cyan-400/70">
            // PLATFORM.2026
          </p>
        </div>
      </button>

      {/* Role Pill */}
      <div className="hidden lg:flex mt-4 w-[calc(100%-2rem)] items-center justify-between px-3 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 font-mono text-[10px] text-cyan-300">
        <span className="flex items-center gap-1.5 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          ROLE: {role}
        </span>
        <Terminal className="h-3 w-3 text-cyan-400/60" />
      </div>

      {/* Navigation */}
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
                  ? 'text-cyan-950 font-bold'
                  : 'text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-300'
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_20px_rgba(0,210,255,0.5)]"
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
                  active ? 'text-cyan-950 font-bold' : 'text-cyan-400/80 group-hover:text-cyan-300'
                )}
              />

              <span className="relative hidden lg:inline font-sans text-xs">
                {t(item.labelKey)}
              </span>

              <span
                className={cn(
                  'relative ml-auto hidden font-mono text-[9px] lg:inline',
                  active ? 'text-cyan-900/80' : 'text-muted-foreground/50'
                )}
              >
                {item.code}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mb-4 flex w-full flex-col items-center gap-2 px-2 lg:px-3">
        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-pink-500/20 bg-pink-500/5 px-3 py-2 font-mono text-xs text-pink-300 transition hover:border-pink-500/50 hover:bg-pink-500/15 hover:shadow-[0_0_15px_rgba(255,42,133,0.2)] lg:justify-start"
        >
          <LogOut className="h-4 w-4 shrink-0 text-pink-400" />
          <span className="hidden lg:inline uppercase font-semibold">
            Logout
          </span>
        </button>

        <LanguageSelector />
      </div>
    </aside>
  );
}