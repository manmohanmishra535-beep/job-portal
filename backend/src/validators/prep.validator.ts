import { z } from 'zod';
import { TopicCategory, QuestionType, UserProgressStatus } from '@prisma/client';

export const createTopicSchema = z.object({
  name: z.string().min(2),
  category: z.nativeEnum(TopicCategory),
  parentId: z.string().optional(),
});

export const createQuestionSchema = z.object({
  topicId: z.string().min(1),
  title: z.string().min(3),
  body: z.string().min(10),
  type: z.nativeEnum(QuestionType),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  options: z.array(z.string()).default([]),
  answer: z.string().min(1),
  explanation: z.string().optional(),
  links: z.array(z.string().url()).default([]),
});

export const updateProgressSchema = z.object({
  status: z.nativeEnum(UserProgressStatus),
});

export const createNoteSchema = z.object({
  topicId: z.string().min(1),
  title: z.string().min(3),
  content: z.string().min(10),
});

export const createCompanyGuideSchema = z.object({
  companyName: z.string().min(2),
  slug: z.string().min(2),
  hiringProcess: z.string(),
  rounds: z.any(),
  tips: z.array(z.string()).default([]),
  commonQuestions: z.any(),
});
