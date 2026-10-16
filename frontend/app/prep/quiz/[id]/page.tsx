'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import QuizEngine from '@/components/QuizEngine';
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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading assessment questions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/prep/quiz"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Exit Quiz & Back to Tests
      </Link>

      <QuizEngine quiz={quiz} />
    </div>
  );
}
