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
  icon: typeof Home;
}

const navItems: NavItem[] = [
  {
    id: 'teacher',
    labelKey: 'nav.teacher',
    icon: GraduationCap,
  },
  {
    id: 'urban',
    labelKey: 'nav.urban',
    icon: Building2,
  },
  {
    id: 'rural',
    labelKey: 'nav.rural',
    icon: Trees,
  },
  {
    id: 'quiz',
    labelKey: 'nav.quiz',
    icon: Brain,
  },
  {
    id: 'attendance',
    labelKey: 'nav.attendance',
    icon: ScanFace,
  },
  {
    id: 'student',
    labelKey: 'nav.student',
    icon: User,
  },
  {
    id: 'parent',
    labelKey: 'nav.parent',
    icon: Users,
  },
  {
    id: 'admin',
    labelKey: 'nav.admin',
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
  role: 'admin' | 'teacher' | 'student';
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
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-20 flex-col items-center border-r border-border/60 bg-card/40 backdrop-blur-xl lg:w-64">

      {/* Logo */}
      <button
        type="button"
        onClick={() => onView('home')}
        className="mt-6 flex items-center gap-3 lg:px-2"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-white"
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

        <span className="hidden font-display text-lg font-bold lg:inline">
          <span className="text-gradient">Edu</span>Sense
        </span>
      </button>

      {/* Navigation */}
      <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-2 scrollbar-hide lg:px-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onView(item.id)}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary/80"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <Icon
                className={cn(
                  'relative h-5 w-5 shrink-0',
                  active && 'text-primary-foreground'
                )}
              />

              <span className="relative hidden lg:inline">
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mb-4 flex w-full flex-col items-center gap-2 px-2">

        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive lg:justify-start"
        >
          <LogOut className="h-5 w-5 shrink-0" />

          <span className="hidden lg:inline">
            Logout
          </span>
        </button>

        <LanguageSelector />
      </div>
    </aside>
  );
}