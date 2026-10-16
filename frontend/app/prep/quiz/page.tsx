import Link from 'next/link';
import { Award, Timer, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          Anti-Cheat Assessment Engine
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Interactive Placement Quizzes
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Simulate real online assessment environments with countdown timers, backend score evaluation, and full explanation reviews.
        </p>
      </div>

      {/* Quizzes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUIZZES.map((quiz) => (
          <div
            key={quiz.id}
            className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {quiz.difficulty}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                  <Timer className="w-3.5 h-3.5 text-cyan-400" />
                  {quiz.duration} Mins
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-white group-hover:text-emerald-400 transition-colors">
                {quiz.title}
              </h3>
              <p className="text-xs font-medium text-indigo-400 mt-1">{quiz.topic}</p>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">{quiz.description}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">
                {quiz.questionCount} Questions • {quiz.attemptsCount} Attempts
              </span>
              <Link
                href={`/prep/quiz/${quiz.id}`}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-transform flex items-center gap-1.5"
              >
                Start Quiz <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
