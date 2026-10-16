'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Timer,
  CheckCircle,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Quiz } from '@/types';
import { quizApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import Badge, { difficultyTone } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';

interface QuizEngineProps {
  quiz: Quiz;
}

export default function QuizEngine({ quiz }: QuizEngineProps) {
  const { getToken, isSignedIn } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  // Synchronous guard: the submit button's `disabled` state only takes effect
  // after a re-render, so two clicks in the same tick (or a click racing the
  // timer expiry) would otherwise create duplicate quiz attempts.
  const submittingRef = useRef(false);

  const questions = quiz.questions || [];
  const currentQ = questions[currentIdx];

  // Countdown ticker. Set up once per attempt (not on every tick) so the
  // interval is stable, and contained entirely to a plain decrement.
  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [result]);

  // Auto-submit when the clock runs out. Kept out of the state updater above so
  // the updater stays pure (React may invoke it more than once in dev), and the
  // synchronous `submittingRef` guard makes this safe if it runs twice.
  useEffect(() => {
    if (timeLeft === 0 && !result) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, result]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option: string) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleSubmit = async () => {
    if (submittingRef.current || result) return;

    if (!isSignedIn) {
      alert('Please sign in to submit your quiz and track your placement score!');
      return;
    }

    submittingRef.current = true;
    try {
      setIsSubmitting(true);
      const token = await getToken();
      if (!token) throw new Error('No session token');

      const timeTaken = quiz.duration * 60 - timeLeft;
      const res = await quizApi.submit(quiz.id, { answers, timeTaken }, token);
      setResult(res.data);
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert('Error submitting quiz. Please try again.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (!currentQ && !result) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-sm text-slate-400">
        No questions loaded for this quiz.
      </div>
    );
  }

  // Results view
  if (result) {
    return (
      <div className="animate-fade-in space-y-8">
        {/* Scorecard */}
        <div className="glass-panel relative overflow-hidden rounded-3xl p-8 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"
          />
          <div className="relative">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
              <Award className="h-10 w-10" />
            </div>

            <h2 className="font-heading text-3xl font-extrabold text-white">
              Quiz Evaluation Completed
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Scored by the backend evaluation engine against master answer keys.
            </p>

            <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <span className="block text-xs uppercase tracking-wider text-slate-400">Score</span>
                <span className="font-heading text-2xl font-bold text-white">
                  {result.score} / {result.totalQuestions}
                </span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <span className="block text-xs uppercase tracking-wider text-slate-400">
                  Accuracy
                </span>
                <span className="font-mono font-heading text-2xl font-bold text-emerald-400">
                  {result.percentage}%
                </span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <span className="block text-xs uppercase tracking-wider text-slate-400">
                  Time Taken
                </span>
                <span className="font-mono font-heading text-2xl font-bold text-cyan-400">
                  {formatTime(result.timeTaken)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review */}
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-bold text-white">
            Answers &amp; Explanations Review
          </h3>
          <div className="space-y-4">
            {result.results?.map((item: any, idx: number) => (
              <div
                key={item.questionId}
                className={cn(
                  'glass-panel rounded-2xl border p-6',
                  item.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-rose-500/30 bg-rose-950/10'
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">#{idx + 1}</span>
                    <h4 className="text-base font-semibold text-white">{item.title}</h4>
                  </div>
                  <Badge tone={item.isCorrect ? 'emerald' : 'rose'}>
                    {item.isCorrect ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" /> Incorrect
                      </>
                    )}
                  </Badge>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                    <span className="mb-1 block text-slate-400">Your Submission:</span>
                    <span
                      className={cn(
                        'font-medium',
                        item.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      )}
                    >
                      {item.candidateAnswer}
                    </span>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                    <span className="mb-1 block text-slate-400">Correct Answer:</span>
                    <span className="font-medium text-emerald-400">{item.correctAnswer}</span>
                  </div>
                </div>

                {item.explanation && (
                  <p className="rounded-lg border border-white/5 bg-white/5 p-3 text-xs leading-relaxed text-slate-300">
                    <strong className="text-indigo-300">Explanation:</strong> {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active quiz
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel space-y-4 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">{quiz.title}</h2>
            <span className="text-xs text-slate-400">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          <div
            role="timer"
            className={cn(
              'flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-sm font-bold',
              timeLeft < 180
                ? 'animate-pulse border-rose-500/30 bg-rose-500/10 text-rose-400'
                : 'border-white/10 bg-white/5 text-cyan-400'
            )}
          >
            <Timer className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <ProgressBar
          value={currentIdx + 1}
          max={questions.length}
          label="Quiz progress"
        />
      </div>

      {/* Question */}
      <div className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
        <div>
          <Badge tone={difficultyTone(currentQ.difficulty)} uppercase>
            {currentQ.difficulty}
          </Badge>
          <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-white">
            {currentQ.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{currentQ.body}</p>
        </div>

        <div role="radiogroup" aria-label="Answer options" className="space-y-3">
          {currentQ.options?.map((opt, optIdx) => {
            const isSelected = answers[currentQ.id] === opt;
            return (
              <button
                key={optIdx}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectOption(opt)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-500/10'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold',
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-400'
                    )}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                </span>
                {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-300" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>

          {currentIdx < questions.length - 1 ? (
            <Button
              variant="secondary"
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 border-emerald-500/50 shadow-[0_10px_30px_-12px_rgba(16,185,129,0.9)] hover:bg-emerald-500"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Final Test'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
