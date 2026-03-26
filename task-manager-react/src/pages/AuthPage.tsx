import { useEffect, useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/api/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
type Mode = 'login' | 'register';

export default function AuthPage() {
  const navigate = useNavigate();
  const {fetchMe}= useAuth()
  useEffect(() => {
    if (document.cookie.includes('accessToken=')) {
      navigate('/dashboard');
    }
  }, []);

  const [mode, setMode] = useState<Mode>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((e2) => ({ ...e2, [field]: '' }));
    };

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (mode === 'register' && !form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
        fetchMe()
      } else {
        await register(form);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setForm({ name: '', email: '', password: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute w-[500px] h-[500px] rounded-full top-[-100px] right-[-100px] pointer-events-none bg-[radial-gradient(circle,rgba(124,106,247,0.12)_0%,transparent_70%)]" />
      <div className="absolute w-[400px] h-[400px] rounded-full bottom-[-80px] left-[-80px] pointer-events-none bg-[radial-gradient(circle,rgba(167,139,250,0.07)_0%,transparent_70%)]" />

      {/* Card */}
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border2)] rounded-[20px] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)] relative z-10">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)]">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="text-[22px] font-extrabold text-[var(--text)] tracking-tight font-[var(--font-display)]">
            TaskFlow
          </span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-[26px] font-bold text-[var(--text)] tracking-tight font-[var(--font-display)]">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {mode === 'login'
              ? 'Sign in to your workspace'
              : 'Start managing your tasks today'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-(--surface2) rounded-[10px] p-1 border border-(--border) mb-7">
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all
                ${
                  mode === m
                    ? 'bg-(--accent) text-white shadow-[0_0_12px_var(--accent-glow)]'
                    : 'text-(--muted)'
                }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <Input
              label="Full Name"
              placeholder='Enter your name'
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              leftIcon={<User size={14} />}
            />
          )}

          <Input
            label="Email"
            placeholder='Enter your email'
            type="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            leftIcon={<Mail size={14} />}
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              placeholder='Enter your password'
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              leftIcon={<Lock size={14} />}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 mt-1 text-(--dimmed) hover:text-(--text) p-1"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-1  font-[var(--font-display)]">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 border-t border-(--border)" />
          <span className="text-xs text-(--dimmed)">OR</span>
          <div className="flex-1 border-t border-(--border)" />
        </div>

        {/* Google */}
        <button
          onClick={() => authApi.googleLogin()}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-[10px] border border-(--border2) bg-(--surface2) text-(--text) text-sm font-medium transition-all hover:border-(--accent) hover:bg-(--surface)"
        >
          {/* <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25..." />
          </svg> */}
          Continue with Google
        </button>
      </div>
    </div>
  );
}