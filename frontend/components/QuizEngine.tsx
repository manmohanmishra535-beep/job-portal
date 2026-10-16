'use client';

import { useState, useEffect } from 'react';
import { Timer, CheckCircle, XCircle, Award, RotateCcw, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Quiz } from '@/types';
import { quizApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

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

  const questions = quiz.questions || [];
  const currentQ = questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (result || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result, timeLeft]);

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
    if (!isSignedIn) {
      alert('Please sign in to submit your quiz and track your placement score!');
      return;
    }

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
      setIsSubmitting(false);
    }
  };

  if (!currentQ && !result) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-gray-400">
        No questions loaded for this quiz.
      </div>
    );
  }

  // Results View
  if (result) {
    return (
      <div className="space-y-8 animate-in fade-in">
        {/* Scorecard Hero */}
        <div className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/30 mb-4">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="font-heading font-extrabold text-3xl text-white">Quiz Evaluation Completed</h2>
          <p className="text-sm text-gray-400 mt-1">
            Scored by backend evaluation engine against master answer keys.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">Score</span>
              <span className="font-heading font-bold text-2xl text-white">
                {result.score} / {result.totalQuestions}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">Accuracy</span>
              <span className="font-heading font-bold text-2xl text-emerald-400 font-mono">
                {result.percentage}%
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">Time Taken</span>
              <span className="font-heading font-bold text-2xl text-cyan-400 font-mono">
                {formatTime(result.timeTaken)}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Review Breakdown */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-xl text-white">Answers & Explanations Review</h3>
          <div className="space-y-4">
            {result.results?.map((item: any, idx: number) => (
              <div
                key={item.questionId}
                className={`glass-panel rounded-2xl p-6 border ${
                  item.isCorrect ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">#{idx + 1}</span>
                    <h4 className="font-semibold text-white text-base">{item.title}</h4>
                  </div>
                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-gray-400 block mb-1">Your Submission:</span>
                    <span className={item.isCorrect ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                      {item.candidateAnswer}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-gray-400 block mb-1">Correct Answer:</span>
                    <span className="text-emerald-400 font-medium">{item.correctAnswer}</span>
                  </div>
                </div>

                {item.explanation && (
                  <p className="text-xs text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5 leading-relaxed">
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

  // Active Quiz Running
  return (
    <div className="space-y-6">
      {/* Top Banner: Quiz Title, Question Progress, Timer */}
      <div className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-white">{quiz.title}</h2>
          <span className="text-xs text-gray-400">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border ${
            timeLeft < 180
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
              : 'bg-white/5 text-cyan-400 border-white/10'
          }`}
        >
          <Timer className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            {currentQ.difficulty}
          </span>
          <h3 className="font-heading font-bold text-xl text-white mt-3 leading-snug">
            {currentQ.title}
          </h3>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">{currentQ.body}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options?.map((opt, optIdx) => {
            const isSelected = answers[currentQ.id] === opt;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation & Submit Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <button
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-2">
            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/15 transition-colors"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Final Test'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
