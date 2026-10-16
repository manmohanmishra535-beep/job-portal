import { z } from 'zod';

export const createQuizSchema = z.object({
  title: z.string().min(3),
  topicId: z.string().min(1),
  duration: z.number().int().positive(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  questionIds: z.array(z.string()).min(1),
});

export const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.string()), // { [questionId]: selectedOption }
  timeTaken: z.number().int().nonnegative(), // time in seconds
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
