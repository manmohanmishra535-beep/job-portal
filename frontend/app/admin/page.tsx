'use client';

import { useState, useEffect } from 'react';
import { Lock, Users, Briefcase, FileText, Award, ShieldCheck } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { formatDate } from '@/lib/utils';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { BadgeTone } from '@/components/ui/Badge';
import { StatCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

function roleTone(role: string): BadgeTone {
  switch (role) {
    case 'ADMIN':
      return 'rose';
    case 'RECRUITER':
      return 'indigo';
    default:
      return 'neutral';
  }
}

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  // Start empty so the UI never presents fabricated figures; values arrive from
  // GET /admin/stats once it resolves.
  const [stats, setStats] = useState<any>({
    users: { total: 0, candidates: 0, recruiters: 0 },
    jobs: { total: 0, active: 0 },
    applications: 0,
    prep: { totalQuestions: 0, quizzesAttempted: 0 },
  });
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const token = await getToken();
        if (token) {
          const [statsRes, usersRes] = await Promise.allSettled([
            adminApi.getStats(token),
            adminApi.getUsers(1, undefined, token),
          ]);
          if (statsRes.status === 'fulfilled' && statsRes.value.data) {
            setStats(statsRes.value.data);
          }
          if (usersRes.status === 'fulfilled' && usersRes.value.data?.users) {
            setUsersList(usersRes.value.data.users);
          }
        }
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [getToken]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = await getToken();
      if (token) {
        await adminApi.changeRole(userId, newRole, token);
        setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Error updating user role.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose-500/15 blur-3xl"
        />
        <div className="relative">
          <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-400">
            <Lock className="h-3.5 w-3.5" /> Platform Governance &amp; Moderation
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">Admin Command Center</h1>
          <p className="mt-1.5 max-w-xl text-sm text-slate-400">
            Monitor platform-wide traffic, verify recruiter companies, and manage placement prep
            content.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.users?.total || 0}
              hint={`${stats.users?.candidates || 0} candidates • ${stats.users?.recruiters || 0} recruiters`}
              tone="indigo"
            />
            <StatCard
              icon={Briefcase}
              label="Job Listings"
              value={stats.jobs?.total || 0}
              hint={`${stats.jobs?.active || 0} currently open`}
              tone="cyan"
            />
            <StatCard
              icon={FileText}
              label="Applications"
              value={stats.applications || 0}
              hint="Platform submissions"
              tone="violet"
            />
            <StatCard
              icon={Award}
              label="Quizzes Taken"
              value={stats.prep?.quizzesAttempted || 0}
              hint={`${stats.prep?.totalQuestions || 0} questions in bank`}
              tone="emerald"
            />
          </>
        )}
      </section>

      {/* User management */}
      <section className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-white">
            <ShieldCheck className="h-5 w-5 text-indigo-400" /> User Accounts &amp; Role Permissions
          </h2>
          <span className="text-xs font-medium text-slate-400">
            Role-Based Access Control (RBAC)
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : usersList.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No user accounts found"
            description="User accounts will appear here once candidates and recruiters sign up."
            className="border-0 bg-transparent py-10 shadow-none"
          />
        ) : (
          <ul className="divide-y divide-white/5">
            {usersList.map((user) => (
              <li
                key={user.id}
                className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-tr from-slate-800 to-slate-700 text-sm font-bold text-white">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {user.name || 'Unnamed User'}
                      </h3>
                      <Badge tone={roleTone(user.role)} uppercase>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-slate-400">
                      {user.email} • Joined {formatDate(user.createdAt)}
                    </p>
                    {user.companies && user.companies.length > 0 && (
                      <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-300">
                        Company: {user.companies[0].name}
                        <Badge tone={user.companies[0].isApproved ? 'emerald' : 'amber'}>
                          {user.companies[0].isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <label className="sr-only" htmlFor={`role-${user.id}`}>
                    Change role for {user.name || user.email}
                  </label>
                  <select
                    id={`role-${user.id}`}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors focus:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
                  >
                    <option value="USER" className="bg-[#0b111e]">
                      Candidate (USER)
                    </option>
                    <option value="RECRUITER" className="bg-[#0b111e]">
                      Recruiter (RECRUITER)
                    </option>
                    <option value="ADMIN" className="bg-[#0b111e]">
                      Administrator (ADMIN)
                    </option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
