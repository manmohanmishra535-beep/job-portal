'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Cpu, Database, Network, ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import RichText from '@/components/ui/RichText';

const SUBJECTS = [
  {
    id: 'os',
    name: 'Operating Systems',
    icon: Cpu,
    topics: [
      {
        title: 'Processes vs. Threads',
        content: `A **Process** is an executing instance of a program with its own address space, memory, open file handles, and registers. 
A **Thread** is the smallest unit of CPU execution within a process that shares code, data, and heap memory, but has its own independent stack and registers.

• **Context Switch Overhead**: Process switching is expensive due to virtual memory map flushing and TLB invalidation; thread switching is significantly lighter.`,
      },
      {
        title: 'The 4 Coffman Deadlock Conditions',
        content: `A deadlock can occur if and only if all four conditions hold simultaneously:
1. **Mutual Exclusion**: At least one resource must be non-shareable.
2. **Hold and Wait**: Process holds at least one resource while waiting to acquire another.
3. **No Preemption**: A resource cannot be forcibly confiscated from a process holding it.
4. **Circular Wait**: A closed loop of processes exists where P1 waits for resource held by P2, P2 waits for P3, and Pn waits for P1.`,
      },
      {
        title: 'Virtual Memory, Paging & Thrashing',
        content: `• **Paging**: Divides virtual memory into fixed-sized blocks called Pages, mapped to physical frames via the Page Table.
• **TLB (Translation Lookaside Buffer)**: High-speed associative hardware cache storing recently translated Virtual to Physical page mappings.
• **Thrashing**: Occurs when total memory demand of active processes exceeds physical RAM capacity, causing CPU to spend majority of time swapping pages rather than executing user instructions.`,
      },
    ],
  },
  {
    id: 'dbms',
    name: 'DBMS & SQL',
    icon: Database,
    topics: [
      {
        title: 'ACID Transaction Properties',
        content: `• **Atomicity**: All operations in a transaction succeed or all fail and roll back (All or Nothing).
• **Consistency**: Database transitions strictly from one valid consistent state to another, enforcing constraints.
• **Isolation**: Concurrent transactions execute as if running serially without dirty interference.
• **Durability**: Once a transaction is committed, its written changes persist even across power failures (WAL/AOF).`,
      },
      {
        title: 'B+ Tree Indexing vs. Hash Indexing',
        content: `• **B+ Tree Indexes**: Balanced search trees where all keys reside in leaf nodes, linked sequentially. Excels at range scans (e.g. \`WHERE salary BETWEEN 50k AND 100k\`), sorting, and prefix matches. Complexity O(log N).
• **Hash Indexes**: Key-value hash tables offering O(1) exact match lookup (\`WHERE id = 42\`), but cannot service range queries or ordering.`,
      },
    ],
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    icon: Network,
    topics: [
      {
        title: 'TCP 3-Way Handshake & 4-Way Teardown',
        content: `**Handshake Connection Setup:**
1. **SYN**: Client sends SYN packet with Initial Sequence Number (ISN_c).
2. **SYN-ACK**: Server replies with SYN-ACK, acknowledging ISN_c + 1 and providing its own ISN_s.
3. **ACK**: Client acknowledges ISN_s + 1. Connection is now ESTABLISHED.

**4-Way Termination:**
FIN (Client) → ACK (Server) → FIN (Server) → ACK (Client) → TIME_WAIT state (2MSL).`,
      },
      {
        title: 'HTTPS, TLS Handshake & Symmetric vs Asymmetric',
        content: `• **Asymmetric Cryptography (RSA / ECDSA)**: Used during initial TLS handshake to verify server digital certificate and securely exchange a ephemeral symmetric session key.
• **Symmetric Cryptography (AES-GCM / ChaCha20)**: Used for bulk application payload encryption after handshake, providing high encryption throughput.`,
      },
    ],
  },
];

export default function TechnicalPrepPage() {
  const [activeSubject, setActiveSubject] = useState(SUBJECTS[0]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/prep"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Prep Hub
      </Link>

      {/* Header */}
      <header>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
          <BookOpen className="h-4 w-4" />
          Core Engineering Disciplines
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Core Computer Science Cheat Sheets
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Concise revision sheets for Operating Systems, Relational DBMS/SQL, and Computer Networks
          tested in technical interview rounds.
        </p>
      </header>

      {/* Subject tabs */}
      <div
        role="tablist"
        aria-label="Subjects"
        className="flex flex-wrap gap-2 border-b border-white/10 pb-3"
      >
        {SUBJECTS.map((sub) => {
          const Icon = sub.icon as LucideIcon;
          const isActive = activeSubject.id === sub.id;
          return (
            <button
              key={sub.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSubject(sub)}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200',
                isActive
                  ? 'border-purple-500/50 bg-purple-600 text-white shadow-[0_10px_30px_-14px_rgba(168,85,247,0.9)]'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {sub.name}
            </button>
          );
        })}
      </div>

      {/* Topics */}
      <div className="grid grid-cols-1 gap-6">
        {activeSubject.topics.map((t, idx) => (
          <section key={idx} className="glass-panel space-y-3 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10 font-mono text-xs font-bold text-violet-300">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-xl font-bold text-indigo-200">{t.title}</h3>
            </div>
            <RichText content={t.content} />
          </section>
        ))}
      </div>
    </div>
  );
}
