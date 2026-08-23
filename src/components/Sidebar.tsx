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
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-20 flex-col items-center border-r border-border/80 bg-card/95 backdrop-blur-sm lg:w-64">
      {/* Logo */}
      <button
        type="button"
        onClick={() => onView('home')}
        className="mt-6 flex items-center gap-3 lg:px-4 group"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="h-6 w-6" />
        </div>

        <div className="hidden text-left lg:block">
          <span className="text-lg font-bold tracking-tight text-foreground">
            EDUSense
          </span>
          <p className="text-xs text-muted-foreground">
            Learning Platform
          </p>
        </div>
      </button>

      {/* Role Pill */}
      <div className="hidden lg:flex mt-4 w-[calc(100%-2rem)] items-center justify-between px-3 py-1.5 rounded-lg border border-border/80 bg-muted/30 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-2 capitalize">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          Role: {role}
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex flex-1 w-full flex-col gap-1 overflow-y-auto px-2 scrollbar-hide lg:px-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onView(item.id)}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />

              <span className="hidden lg:inline text-xs">
                {t(item.labelKey)}
              </span>

              <span
                className={cn(
                  'ml-auto hidden text-[11px] lg:inline',
                  active ? 'text-primary-foreground/70' : 'text-muted-foreground/60'
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
          className="group flex w-full items-center justify-center gap-2.5 rounded-lg border border-border/80 bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 lg:justify-start"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">
            Log out
          </span>
        </button>

        <LanguageSelector />
      </div>
    </aside>
  );
}