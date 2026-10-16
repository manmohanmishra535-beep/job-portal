'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import QuizEngine from '@/components/QuizEngine';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { Quiz } from '@/types';
import { quizApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

const FALLBACK_QUIZ: Quiz = {
  id: 'quiz-speed-test',
  title: 'Aptitude & Core CS Speed Challenge',
  topicId: 'topic-apt-tsd',
  duration: 15,
  difficulty: 'Medium',
  questions: [
    {
      id: 'q-apt-1',
      topicId: 'topic-apt-tsd',
      title: 'Train Crossing Platform Speed Problem',
      body: 'A train 240 meters long passes a telegraph pole in 16 seconds. How long will it take to pass a platform 420 meters long at the same speed?',
      type: 'MCQ',
      difficulty: 'Easy',
      options: ['28 seconds', '44 seconds', '36 seconds', '40 seconds'],
      links: [],
    },
    {
      id: 'q-tech-1',
      topicId: 'topic-tech-os',
      title: 'Deadlock Necessary Conditions',
      body: 'Which of the following is NOT one of the 4 Coffman conditions required for an Operating System deadlock to occur?',
      type: 'MCQ',
      difficulty: 'Medium',
      options: ['Mutual Exclusion', 'Preemptive Scheduling', 'Hold and Wait', 'Circular Wait'],
      links: [],
    },
    {
      id: 'q-apt-2',
      topicId: 'topic-apt-tsd',
      title: 'Work Efficiency & Remaining Fractions',
      body: 'A can complete a piece of work in 12 days and B in 18 days. If they work together for 4 days, what fraction of the work remains unfinished?',
      type: 'MCQ',
      difficulty: 'Easy',
      options: ['1/3', '4/9', '5/9', '2/9'],
      links: [],
    },
  ],
};

export default function ActiveQuizPage() {
  const { id } = useParams() as { id: string };
  const { getToken } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await quizApi.getById(id, token);
        setQuiz(res.data);
      } catch {
        setQuiz(FALLBACK_QUIZ);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [id, getToken]);

  if (loading || !quiz) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-40" />
        <div className="glass-panel space-y-4 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <div className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-6 w-3/4" />
          <SkeletonText lines={2} />
          <div className="space-y-3 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/prep/quiz"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Exit Quiz & Back to Tests
      </Link>

      <QuizEngine quiz={quiz} />
    </div>
  );
}
