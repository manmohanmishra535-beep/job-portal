'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Award,
  CheckCircle2,
  XCircle,
  Lock,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { formatDate } from '@/lib/utils';

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
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Error updating user role.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white/10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 block mb-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Platform Governance & Moderation
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Admin Command Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Monitor platform-wide traffic, verify recruiter companies, and manage placement prep content.
          </p>
        </div>
      </div>

      {/* Platform-Wide Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Total Users
          </span>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            {stats.users?.total || 0}
          </span>
          <p className="text-[11px] text-gray-400 mt-1">
            {stats.users?.candidates || 0} Candidates • {stats.users?.recruiters || 0} Recruiters
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Total Job Listings
          </span>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-indigo-400 font-mono">
            {stats.jobs?.total || 0}
          </span>
          <p className="text-[11px] text-gray-400 mt-1">{stats.jobs?.active || 0} currently OPEN</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Applications Processed
          </span>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-cyan-400 font-mono">
            {stats.applications || 0}
          </span>
          <p className="text-[11px] text-gray-400 mt-1">Platform submissions</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Quizzes Taken
          </span>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 font-mono">
            {stats.prep?.quizzesAttempted || 0}
          </span>
          <p className="text-[11px] text-gray-400 mt-1">Anti-cheat evaluations</p>
        </div>
      </div>

      {/* User Management & Role Control */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> User Accounts & Role Permissions
          </h2>
          <span className="text-xs text-gray-400 font-medium">Role-Based Access Control (RBAC)</span>
        </div>

        <div className="divide-y divide-white/5 overflow-x-auto">
          {usersList.map((user) => (
            <div
              key={user.id}
              className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-sm text-white">{user.name || 'Unnamed User'}</h3>
                <p className="text-xs text-gray-400">
                  {user.email} • Joined {formatDate(user.createdAt)}
                </p>
                {user.companies && user.companies.length > 0 && (
                  <span className="text-[11px] text-amber-400 font-medium mt-1 inline-block">
                    Company: {user.companies[0].name} (
                    {user.companies[0].isApproved ? 'Approved' : 'Pending Approval'})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Change Role:</span>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="USER" className="bg-[#0f172a]">Candidate (USER)</option>
                  <option value="RECRUITER" className="bg-[#0f172a]">Recruiter (RECRUITER)</option>
                  <option value="ADMIN" className="bg-[#0f172a]">Administrator (ADMIN)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
