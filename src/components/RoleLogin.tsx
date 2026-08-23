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
  label: string;
  placeholder: string;
  icon: typeof ShieldCheck;
  demoId: string;
  demoPassword: string;
};

const roleInfo: Record<LoginRole, RoleInfo> = {
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Secure administrator access',
    label: 'Admin ID',
    placeholder: 'Enter admin ID',
    icon: ShieldCheck,
    demoId: 'admin001',
    demoPassword: 'Admin@123',
  },

  teacher: {
    title: 'Teacher Dashboard',
    subtitle: 'Secure teacher access',
    label: 'Teacher ID',
    placeholder: 'Enter teacher ID',
    icon: GraduationCap,
    demoId: 'teacher001',
    demoPassword: 'EduSense@123',
  },

  student: {
    title: 'Student Dashboard',
    subtitle: 'Secure student access',
    label: 'Student Roll Number',
    placeholder: 'Enter roll number',
    icon: UserRound,
    demoId: 'SNIST10A042',
    demoPassword: 'Student@123',
  },

  parent: {
    title: 'Parent Dashboard',
    subtitle: 'Student verification login',
    label: 'Student Roll Number',
    placeholder: 'Enter child roll number',
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
    toast.success('Demo OTP sent successfully. Use 123456');
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    // Small simulated network delay
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 500);
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

      toast.error('Invalid Student Details or OTP. Hint: SNIST10A042, Aarav Reddy, OTP: 123456');
      setLoading(false);
      return;
    }

    const enteredId = identifier.trim();
    const enteredPassword = password;

    const validCredentials =
      enteredId === info.demoId &&
      enteredPassword === info.demoPassword;

    if (!validCredentials) {
      toast.error('Invalid login credentials.');
      setLoading(false);
      return;
    }

    localStorage.setItem('vidya_auth_role', role);
    localStorage.setItem('vidya_auth_user', info.demoId);
    localStorage.setItem('vidya_auth_name', info.title);
    localStorage.setItem('vidya_authenticated', 'true');

    toast.success('Login successful');
    setLoading(false);
    onSuccess(role);
  };

  const isSubmitDisabled =
    loading ||
    identifier.trim().length === 0 ||
    (role === 'parent'
      ? studentName.trim().length === 0 || otp.trim().length === 0
      : password.length === 0);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.07]" />

      <div className="relative z-10 w-full max-w-md">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="mb-5 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portals
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass overflow-hidden">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="h-7 w-7" />
              </div>

              <CardTitle className="text-2xl">
                {info.title}
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                {info.subtitle}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={submit} className="space-y-5">
                {role === 'parent' ? (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="student-roll" className="text-sm font-medium">
                        Student Roll Number
                      </label>
                      <Input
                        id="student-roll"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter Student Roll Number (e.g. SNIST10A042)"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="student-name" className="text-sm font-medium">
                        Student Name
                      </label>
                      <Input
                        id="student-name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter Student Name (e.g. Aarav Reddy)"
                        disabled={loading}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={sendOtp}
                      disabled={loading || !identifier.trim()}
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </Button>

                    {otpSent && (
                      <div className="space-y-2">
                        <label htmlFor="otp-input" className="text-sm font-medium">
                          OTP Verification
                        </label>
                        <Input
                          id="otp-input"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP (123456)"
                          maxLength={6}
                          disabled={loading}
                        />
                      </div>
                    )}

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                      <div className="font-semibold text-foreground mb-1">
                        Demo Parent Credentials
                      </div>
                      <div>Roll No: <span className="font-mono font-medium text-foreground">SNIST10A042</span></div>
                      <div>Student: <span className="font-mono font-medium text-foreground">Aarav Reddy</span></div>
                      <div>OTP: <span className="font-mono font-medium text-foreground">123456</span></div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Identifier */}
                    <div className="space-y-2">
                      <label
                        htmlFor="identifier"
                        className="text-sm font-medium"
                      >
                        {info.label}
                      </label>

                      <Input
                        id="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={info.placeholder}
                        autoComplete="username"
                        disabled={loading}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium"
                      >
                        Password
                      </label>

                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-11"
                          autoComplete="current-password"
                          disabled={loading}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((current) => !current)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <LockKeyhole className="h-4 w-4" />
                        Demo credentials
                      </div>

                      <div className="mt-1">
                        ID:{' '}
                        <span className="font-mono">
                          {info.demoId}
                        </span>

                        {' · '}

                        Password:{' '}
                        <span className="font-mono">
                          {info.demoPassword}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitDisabled}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}