import { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  GraduationCap,
  UserRound,
  KeyRound,
  Terminal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { PortalRole } from './PortalSelector';

export type LoginRole = PortalRole;

type RoleInfo = {
  title: string;
  subtitle: string;
  code: string;
  label: string;
  placeholder: string;
  icon: typeof ShieldCheck;
  demoId: string;
  demoPassword: string;
};

const roleInfo: Record<LoginRole, RoleInfo> = {
  admin: {
    title: 'Admin Portal',
    subtitle: 'Sign in with administrator credentials',
    code: 'SYS.ADM-01',
    label: 'Admin ID',
    placeholder: 'Enter admin ID (admin001)',
    icon: ShieldCheck,
    demoId: 'admin001',
    demoPassword: 'Admin@123',
  },

  teacher: {
    title: 'Teacher Portal',
    subtitle: 'Sign in with teacher credentials',
    code: 'EDU.TCH-02',
    label: 'Teacher ID',
    placeholder: 'Enter teacher ID (teacher001)',
    icon: GraduationCap,
    demoId: 'teacher001',
    demoPassword: 'EduSense@123',
  },

  student: {
    title: 'Student Portal',
    subtitle: 'Sign in with student roll number',
    code: 'LRN.STU-03',
    label: 'Student Roll Number',
    placeholder: 'Enter roll number (SNIST10A042)',
    icon: UserRound,
    demoId: 'SNIST10A042',
    demoPassword: 'Student@123',
  },

  parent: {
    title: 'Parent Portal',
    subtitle: 'Student verification & OTP login',
    code: 'COM.PAR-04',
    label: 'Student Roll Number',
    placeholder: 'Enter child roll number (SNIST10A042)',
    icon: UserRound,
    demoId: 'SNIST10A042',
    demoPassword: '123456',
  },
};

export default function RoleLogin({
  role,
  onSuccess,
  onBack,
}: {
  role: LoginRole;
  onSuccess: (role: LoginRole) => void;
  onBack: () => void;
}) {
  const info = roleInfo[role];
  const Icon = info.icon;

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');

  const sendOtp = () => {
    if (!identifier.trim()) {
      toast.error('Please enter the Student Roll Number first.');
      return;
    }

    setOtpSent(true);
    toast.success('Demo OTP sent successfully: 123456');
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    // Small simulated network delay
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 400);
    });

    if (role === 'parent') {
      const isRollValid = identifier.trim().toUpperCase() === 'SNIST10A042';
      const isNameValid = studentName.trim().toLowerCase() === 'aarav reddy';
      const isOtpValid = otp.trim() === '123456';

      if (isRollValid && isNameValid && isOtpValid) {
        localStorage.setItem('vidya_auth_role', 'parent');
        localStorage.setItem('vidya_auth_user', 'SNIST10A042');
        localStorage.setItem('vidya_auth_name', 'Aarav Reddy (Parent)');
        localStorage.setItem('vidya_authenticated', 'true');

        toast.success('Parent Login Successful');
        setLoading(false);
        onSuccess('parent');
        return;
      }

      toast.error('Invalid details. Hint: SNIST10A042, Aarav Reddy, OTP: 123456');
      setLoading(false);
      return;
    }

    const enteredId = identifier.trim();
    const enteredPassword = password;

    const validCredentials =
      enteredId === info.demoId &&
      enteredPassword === info.demoPassword;

    if (validCredentials) {
      localStorage.setItem('vidya_auth_role', role);
      localStorage.setItem('vidya_auth_user', enteredId);
      localStorage.setItem('vidya_authenticated', 'true');

      let userName = 'User';

      if (role === 'admin') {
        userName = 'Administrator';
      } else if (role === 'teacher') {
        userName = 'Dr. Sarah Rao';
      } else if (role === 'student') {
        userName = 'Aarav Reddy';
      }

      localStorage.setItem('vidya_auth_name', userName);

      toast.success(`${info.title} Login Successful`);
      setLoading(false);
      onSuccess(role);
      return;
    }

    toast.error(`Invalid credentials. Demo: ${info.demoId} / ${info.demoPassword}`);
    setLoading(false);
  };

  const isSubmitDisabled =
    loading ||
    identifier.trim().length === 0 ||
    (role === 'parent'
      ? studentName.trim().length === 0 || otp.trim().length === 0
      : password.length === 0);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0e1f] px-6 py-12">
      {/* Background Grid Accent */}
      <div className="absolute inset-x-0 bottom-0 h-80 retro-grid-subtle opacity-20 pointer-events-none" />

      {/* Ambient Lights */}
      <div className="absolute -left-28 -top-28 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 h-[400px] w-[400px] rounded-full bg-pink-500/15 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="mb-4 gap-2 text-sm text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portals
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl border border-cyan-500/25 bg-[#11172e]/90 p-2 backdrop-blur-xl shadow-xl">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto mb-2.5 flex h-13 w-13 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                <Icon className="h-6 w-6" />
              </div>

              <div className="inline-flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan-400/80 mb-0.5">
                <Terminal className="h-3 w-3" />
                {info.code} // PORTAL ACCESS
              </div>

              <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                {info.title}
              </CardTitle>

              <p className="text-xs text-muted-foreground">
                {info.subtitle}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                {role === 'parent' ? (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="student-roll" className="text-xs font-medium text-foreground">
                        Student Roll Number
                      </label>
                      <Input
                        id="student-roll"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="SNIST10A042"
                        className="border-cyan-500/30 bg-[#0e142c] focus:border-cyan-400"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="student-name" className="text-xs font-medium text-foreground">
                        Student Name
                      </label>
                      <Input
                        id="student-name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Aarav Reddy"
                        className="border-cyan-500/30 bg-[#0e142c] focus:border-cyan-400"
                        disabled={loading}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-xs font-semibold border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                      onClick={sendOtp}
                      disabled={loading || !identifier.trim()}
                    >
                      {otpSent ? 'Resend OTP' : 'Send Verification OTP'}
                    </Button>

                    {otpSent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1.5"
                      >
                        <label htmlFor="otp-input" className="text-xs font-medium text-pink-400">
                          Enter 6-Digit OTP
                        </label>
                        <Input
                          id="otp-input"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          className="font-mono text-center tracking-[0.25em] text-base border-pink-500/40 bg-[#0e142c] text-pink-300"
                          disabled={loading}
                        />
                      </motion.div>
                    )}

                    <div className="rounded-xl border border-cyan-500/20 bg-[#0c1024] p-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-semibold text-cyan-400 mb-1">
                        <KeyRound className="h-3.5 w-3.5" />
                        Demo Credentials
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40 font-mono">
                        <span>Roll:</span>
                        <span className="text-foreground font-semibold">SNIST10A042</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40 font-mono">
                        <span>Name:</span>
                        <span className="text-foreground font-semibold">Aarav Reddy</span>
                      </div>
                      <div className="flex justify-between py-0.5 font-mono">
                        <span>OTP:</span>
                        <span className="text-pink-400 font-semibold">123456</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Identifier */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="identifier"
                        className="text-xs font-medium text-foreground"
                      >
                        {info.label}
                      </label>

                      <Input
                        id="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={info.placeholder}
                        autoComplete="username"
                        className="border-cyan-500/30 bg-[#0e142c] focus:border-cyan-400"
                        disabled={loading}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="password"
                        className="text-xs font-medium text-foreground"
                      >
                        Password
                      </label>

                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10 border-cyan-500/30 bg-[#0e142c] focus:border-cyan-400"
                          autoComplete="current-password"
                          disabled={loading}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((current) => !current)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-cyan-300 transition-colors"
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Demo credentials */}
                    <div className="rounded-xl border border-cyan-500/20 bg-[#0c1024] p-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-semibold text-cyan-400 mb-1">
                        <LockKeyhole className="h-3.5 w-3.5" />
                        Demo Credentials
                      </div>

                      <div className="flex justify-between py-0.5 border-b border-border/40 font-mono">
                        <span>ID:</span>
                        <span className="text-foreground font-semibold">{info.demoId}</span>
                      </div>

                      <div className="flex justify-between py-0.5 font-mono">
                        <span>Password:</span>
                        <span className="text-pink-400 font-semibold">{info.demoPassword}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-pink-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:shadow-[0_0_30px_rgba(0,210,255,0.55)] transition disabled:opacity-50"
                  disabled={isSubmitDisabled}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}