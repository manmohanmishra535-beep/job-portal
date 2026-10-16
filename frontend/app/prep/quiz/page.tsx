import Link from 'next/link';
import { Award, Timer, ArrowRight, ArrowLeft, ListChecks, Users } from 'lucide-react';
import Badge, { difficultyTone } from '@/components/ui/Badge';

const QUIZZES = [
  {
    id: 'quiz-speed-test',
    title: 'Aptitude & Core CS Speed Challenge',
    topic: 'Quantitative Aptitude & Operating Systems',
    duration: 15, // minutes
    difficulty: 'Medium',
    questionCount: 10,
    attemptsCount: 342,
    description:
      'Evaluate your speed under strict time pressure across relative velocity, LCM unit work, and OS deadlocks.',
  },
  {
    id: 'quiz-dsa-fundamentals',
    title: 'Algorithmic Complexity & DSA Quiz',
    topic: 'Time Complexities & Data Structures',
    duration: 20,
    difficulty: 'Hard',
    questionCount: 12,
    attemptsCount: 218,
    description:
      'Test your understanding of Big-O notations, tree traversals, and dynamic programming state transitions.',
  },
];

export default function QuizListPage() {
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
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Award className="h-4 w-4" />
          Anti-Cheat Assessment Engine
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Interactive Placement Quizzes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Simulate real online assessment environments with countdown timers, backend score
          evaluation, and full explanation reviews.
        </p>
      </header>

      {/* Quizzes */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {QUIZZES.map((quiz) => (
          <article
            key={quiz.id}
            className="glass-panel group flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_28px_60px_-36px_rgba(16,185,129,0.7)] sm:p-8"
          >
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <Badge tone={difficultyTone(quiz.difficulty)} uppercase>
                  {quiz.difficulty}
                </Badge>
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                  <Timer className="h-3.5 w-3.5 text-cyan-400" />
                  {quiz.duration} mins
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-white transition-colors group-hover:text-emerald-300">
                {quiz.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-indigo-300">{quiz.topic}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{quiz.description}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs">
              <span className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ListChecks className="h-3.5 w-3.5" />
                  {quiz.questionCount} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {quiz.attemptsCount} attempts
                </span>
              </span>
              <Link
                href={`/prep/quiz/${quiz.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.9)] transition-colors hover:bg-emerald-500"
              >
                Start Quiz <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
