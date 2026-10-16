'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Cpu, Database, Network, Layout, ArrowLeft } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/prep"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Prep Hub
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          Core Engineering Disciplines
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Core Computer Science Cheat Sheets
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Concise revision sheets for Operating Systems, Relational DBMS/SQL, and Computer Networks tested in technical interview rounds.
        </p>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
        {SUBJECTS.map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubject.id === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubject(sub)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'glass-panel text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {sub.name}
            </button>
          );
        })}
      </div>

      {/* Topics Stack */}
      <div className="grid grid-cols-1 gap-6">
        {activeSubject.topics.map((t, idx) => (
          <div key={idx} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3">
            <h3 className="font-heading font-bold text-xl text-white text-indigo-300">
              {t.title}
            </h3>
            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line font-sans">
              {t.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
