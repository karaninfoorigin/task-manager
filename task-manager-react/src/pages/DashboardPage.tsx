import { useState, useEffect } from 'react';
import { User, Mail, Shield, Pencil, CheckCircle, Key } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });
 const { fetchMe } = useAuth();
  // const isInitialized = useAuthStore((s) => s.isInitialized);

  // useEffect(() => {
  //   console.log("hello")
  //   fetchMe();
  // }, []);

  // if (!isInitialized) {
  //   return null; 
  // }
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, string> = {};
      if (form.name !== user?.name) payload.name = form.name;
      if (form.email !== user?.email) payload.email = form.email;
      if (form.password) payload.password = form.password;

      await authApi.updateProfile('me', payload);

      setUser({ ...user!, ...payload });
      toast.success('Profile updated!');
      setEditOpen(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Account type',
      value: user?.provider === 'google' ? 'Google OAuth' : 'Email / Password',
      icon: Shield,
    },
    { label: 'Email', value: user?.email ?? '—', icon: Mail },
    { label: 'Display name', value: user?.name ?? '—', icon: User },
  ];

  return (
    <div className="max-w-[720px]">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent2)] font-display mb-1">
          Your workspace
        </p>
        <h1 className="text-[34px] font-extrabold tracking-tight text-[var(--text)] font-display mb-2">
          {user?.name ? `Hey, ${user.name.split(' ')[0]} 👋` : 'Dashboard'}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Manage your profile and account settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="relative mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 overflow-hidden">

        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />

        <div className="flex flex-wrap items-start justify-between gap-4">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-white text-lg font-bold shadow-[0_0_24px_var(--accent-glow)] font-display">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>

            <div>
              <h2 className="text-lg font-bold text-[var(--text)] font-display">
                {user?.name}
              </h2>
              <p className="text-xs text-[var(--muted)]">{user?.email}</p>

              {/* Badge */}
              <span
                className={`inline-flex items-center gap-1 mt-1 px-2.5 py-[2px] rounded-full text-[11px] font-semibold font-display border ${
                  user?.provider === 'google'
                    ? 'bg-green-500/10 text-green-400 border-green-400/30'
                    : 'bg-[var(--accent2)]/10 text-[var(--accent2)] border-[var(--accent2)]/30'
                }`}
              >
                <CheckCircle size={10} />
                {user?.provider === 'google'
                  ? 'Google account'
                  : 'Local account'}
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setForm({
                name: user?.name ?? '',
                email: user?.email ?? '',
                password: '',
              });
              setEditOpen(true);
            }}
          >
            <Pencil size={13} />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-center gap-2">
              <Icon size={13} className="text-[var(--dimmed)]" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--dimmed)] font-display">
                {label}
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--text)] break-all">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            leftIcon={<User size={13} />}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            leftIcon={<Mail size={13} />}
          />
          {user?.provider === 'local' && (
            <Input
              label="New Password"
              type="password"
              placeholder="Leave blank to keep current"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              leftIcon={<Key size={13} />}
            />
          )}
          <div className="flex justify-end gap-2 mt-1">
            <Button variant="ghost" type="button" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}