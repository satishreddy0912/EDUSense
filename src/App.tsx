import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { I18nProvider } from '@/i18n';

import PortalSelector, {
  type PortalRole,
} from '@/components/PortalSelector';

import RoleLogin from '@/components/RoleLogin';

import Sidebar, {
  type View,
} from '@/components/Sidebar';

import UrbanMode from '@/components/UrbanMode';
import RuralMode from '@/components/RuralMode';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import QuizGenerator from '@/components/QuizGenerator';
import ParentDashboard from '@/components/ParentDashboard';
import AttendanceDashboard from '@/components/AttendanceDashboard';

type AuthRole = Exclude<PortalRole, 'parent'>;

function getSavedRole(): AuthRole | null {
  const savedRole = localStorage.getItem('vidya_auth_role');

  if (
    savedRole === 'admin' ||
    savedRole === 'teacher' ||
    savedRole === 'student'
  ) {
    return savedRole;
  }

  return null;
}

function isAuthenticated(): boolean {
  return localStorage.getItem('vidya_authenticated') === 'true';
}

function getInitialView(role: AuthRole): View {
  switch (role) {
    case 'teacher':
      return 'teacher';

    case 'student':
      return 'student';

    case 'admin':
    default:
      return 'admin';
  }
}

function AppContent() {
  const initialRole = isAuthenticated()
    ? getSavedRole()
    : null;

  const [portal, setPortal] = useState<PortalRole | null>(null);

  const [role, setRole] = useState<AuthRole | null>(
    initialRole
  );

  const [view, setView] = useState<View>(
    initialRole
      ? getInitialView(initialRole)
      : 'home'
  );

  const handlePortal = (selected: PortalRole) => {
    setPortal(selected);
  };

  const handleLogin = (loggedRole: AuthRole) => {
    localStorage.setItem(
      'vidya_auth_role',
      loggedRole
    );

    localStorage.setItem(
      'vidya_authenticated',
      'true'
    );

    setRole(loggedRole);
    setPortal(null);

    setView(getInitialView(loggedRole));
  };

  const logout = () => {
    localStorage.removeItem('vidya_auth_role');
    localStorage.removeItem('vidya_auth_user');
    localStorage.removeItem('vidya_auth_name');
    localStorage.removeItem('vidya_auth_token');
    localStorage.removeItem('vidya_authenticated');

    setRole(null);
    setPortal(null);
    setView('home');
  };

  /* =========================================================
     NOT AUTHENTICATED
  ========================================================== */

  if (!role) {
    if (portal === 'parent') {
      return (
        <div className="min-h-screen bg-background px-6 py-8">
          <button
            type="button"
            onClick={() => setPortal(null)}
            className="mb-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to portals
          </button>

          <ParentDashboard />
        </div>
      );
    }

    if (
      portal === 'admin' ||
      portal === 'teacher' ||
      portal === 'student'
    ) {
      return (
        <RoleLogin
          role={portal}
          onSuccess={handleLogin}
          onBack={() => setPortal(null)}
        />
      );
    }

    return (
      <PortalSelector
        onSelect={handlePortal}
      />
    );
  }

  /* =========================================================
     AUTHENTICATED APPLICATION
  ========================================================== */

  const renderView = () => {
    switch (view) {
      case 'teacher':
        return <TeacherDashboard />;

      case 'urban':
        return <UrbanMode />;

      case 'rural':
        return <RuralMode />;

      case 'quiz':
        return <QuizGenerator />;

      case 'attendance':
        return <AttendanceDashboard />;

      case 'student':
        return <StudentDashboard />;

      case 'admin':
        return <AdminDashboard />;

      case 'home':
      default:
        return getInitialView(role) === 'teacher'
          ? <TeacherDashboard />
          : getInitialView(role) === 'student'
            ? <StudentDashboard />
            : <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <Sidebar
        view={view}
        onView={setView}
        role={role}
        onLogout={logout}
      />

      <main className="pl-20 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -12,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}