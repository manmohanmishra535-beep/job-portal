export type Role = 'USER' | 'RECRUITER' | 'ADMIN';

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'HIRED';

export type QuestionType = 'MCQ' | 'CODING' | 'THEORY' | 'HR';
export type TopicCategory = 'APTITUDE' | 'DSA' | 'TECHNICAL' | 'HR';
export type UserProgressStatus = 'NOT_STARTED' | 'ATTEMPTED' | 'SOLVED';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any[];
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  isApproved?: boolean;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';
  salaryMin?: number | null;
  salaryMax?: number | null;
  skills: string[];
  experienceLevel: 'Fresher' | 'Mid' | 'Senior';
  status: 'OPEN' | 'CLOSED';
  companyId: string;
  company: Company;
  createdAt: string;
  isSaved?: boolean;
  hasApplied?: boolean;
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  resumeUrl?: string | null;
  coverLetter?: string | null;
  appliedAt: string;
  job: Job;
  user?: {
    id: string;
    name: string | null;
    email: string;
    profile?: {
      phone?: string | null;
      college?: string | null;
      skills: string[];
      resumeUrl?: string | null;
    };
  };
}

export interface Topic {
  id: string;
  name: string;
  category: TopicCategory;
  parentId?: string | null;
  _count?: {
    questions: number;
    notes: number;
    quizzes: number;
  };
}

export interface Question {
  id: string;
  topicId: string;
  title: string;
  body: string;
  type: QuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pattern?: string | null;
  options?: string[];
  answer?: string;
  explanation?: string | null;
  links: string[];
  isBookmarked?: boolean;
  progressStatus?: UserProgressStatus;
  topic?: Topic;
}

export interface Note {
  id: string;
  topicId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CompanyGuide {
  id: string;
  companyName: string;
  slug: string;
  hiringProcess: string;
  rounds: {
    name: string;
    duration: string;
    focus: string;
  }[];
  tips: string[];
  commonQuestions: {
    title: string;
    difficulty: string;
    topic: string;
  }[];
}

export interface Quiz {
  id: string;
  title: string;
  topicId: string;
  duration: number; // minutes
  difficulty: string;
  totalQuestions?: number;
  topic?: Topic;
  questions?: Question[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  answers: any;
  takenAt: string;
  quiz?: Quiz;
}

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
  profile?: {
    phone?: string | null;
    college?: string | null;
    skills: string[];
    resumeUrl?: string | null;
    location?: string | null;
    experience?: string | null;
  } | null;
  _count?: {
    applications: number;
    savedJobs: number;
    progress: number;
    quizAttempts: number;
  };
}
