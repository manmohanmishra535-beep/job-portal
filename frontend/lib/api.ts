import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `API request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

// Jobs API
export const jobsApi = {
  list: (params: Record<string, any> = {}, token?: string | null) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return fetchApi<{ jobs: any[]; pagination: any }>(`/jobs?${query.toString()}`, {}, token);
  },
  getById: (id: string, token?: string | null) => fetchApi<any>(`/jobs/${id}`, {}, token),
  create: (data: any, token: string) =>
    fetchApi<any>('/jobs', { method: 'POST', body: JSON.stringify(data) }, token),
  update: (id: string, data: any, token: string) =>
    fetchApi<any>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (id: string, token: string) =>
    fetchApi<any>(`/jobs/${id}`, { method: 'DELETE' }, token),
  toggleSave: (id: string, token: string) =>
    fetchApi<{ saved: boolean; message: string }>(`/jobs/${id}/save`, { method: 'POST' }, token),
  getSaved: (token: string) => fetchApi<any[]>('/jobs/saved/me', {}, token),
};

// Applications API
export const applicationsApi = {
  apply: (jobId: string, data: { resumeUrl?: string; coverLetter?: string }, token: string) =>
    fetchApi<any>(`/jobs/${jobId}/apply`, { method: 'POST', body: JSON.stringify(data) }, token),
  getMyApplications: (token: string) => fetchApi<any[]>('/applications/me', {}, token),
  getJobApplicants: (jobId: string, token: string) =>
    fetchApi<any[]>(`/recruiter/jobs/${jobId}/applications`, {}, token),
  updateStatus: (applicationId: string, status: string, token: string) =>
    fetchApi<any>(
      `/applications/${applicationId}/status`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
      token
    ),
};

// Preparation API
export const prepApi = {
  getTopics: (category?: string, token?: string | null) => {
    const url = category ? `/topics?category=${category}` : '/topics';
    return fetchApi<any[]>(url, {}, token);
  },
  getTopicQuestions: (topicId: string, filters: any = {}, token?: string | null) => {
    const query = new URLSearchParams(filters).toString();
    return fetchApi<{ questions: any[]; pagination: any }>(`/topics/${topicId}/questions?${query}`, {}, token);
  },
  getQuestionById: (id: string, token?: string | null) => fetchApi<any>(`/questions/${id}`, {}, token),
  getTopicNotes: (topicId: string, token?: string | null) => fetchApi<any[]>(`/topics/${topicId}/notes`, {}, token),
  getCompanies: (token?: string | null) => fetchApi<any[]>('/companies', {}, token),
  getCompanyBySlug: (slug: string, token?: string | null) => fetchApi<any>(`/companies/${slug}`, {}, token),
  toggleBookmark: (questionId: string, token: string) =>
    fetchApi<{ isBookmarked: boolean }>(`/questions/${questionId}/bookmark`, { method: 'POST' }, token),
  getBookmarks: (token: string) => fetchApi<any[]>('/bookmarks/me', {}, token),
};

// Quiz API
export const quizApi = {
  list: (token?: string | null) => fetchApi<any[]>('/quizzes', {}, token),
  getById: (id: string, token?: string | null) => fetchApi<any>(`/quizzes/${id}`, {}, token),
  submit: (id: string, data: { answers: Record<string, string>; timeTaken: number }, token: string) =>
    fetchApi<any>(`/quizzes/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }, token),
  getMyAttempts: (token: string) => fetchApi<any[]>('/quizzes/attempts/me', {}, token),
};

// Progress API
export const progressApi = {
  updateStatus: (questionId: string, status: string, token: string) =>
    fetchApi<any>(
      `/progress/questions/${questionId}`,
      { method: 'PUT', body: JSON.stringify({ status }) },
      token
    ),
  getMyProgress: (token: string) => fetchApi<any>('/progress/me', {}, token),
};

// Recruiter API
export const recruiterApi = {
  getStats: (token: string) => fetchApi<any>('/recruiter/stats', {}, token),
  getMyJobs: (token: string) => fetchApi<any[]>('/recruiter/jobs', {}, token),
  updateCompany: (data: any, token: string) =>
    fetchApi<any>('/recruiter/company', { method: 'POST', body: JSON.stringify(data) }, token),
};

// Admin API
export const adminApi = {
  getStats: (token: string) => fetchApi<any>('/admin/stats', {}, token),
  getUsers: (page = 1, role?: string, token?: string) => {
    const q = new URLSearchParams({ page: String(page) });
    if (role) q.append('role', role);
    return fetchApi<any>(`/admin/users?${q.toString()}`, {}, token);
  },
  changeRole: (userId: string, role: string, token: string) =>
    fetchApi<any>(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }, token),
  setCompanyApproval: (companyId: string, isApproved: boolean, token: string) =>
    fetchApi<any>(
      `/admin/recruiters/${companyId}/approve`,
      { method: 'PATCH', body: JSON.stringify({ isApproved }) },
      token
    ),
};

// User Profile API
export const userApi = {
  getMe: (token: string) => fetchApi<any>('/users/me', {}, token),
  updateMe: (data: any, token: string) =>
    fetchApi<any>('/users/me', { method: 'PUT', body: JSON.stringify(data) }, token),
  saveResume: (resumeUrl: string, token: string) =>
    fetchApi<any>('/users/me/resume', { method: 'POST', body: JSON.stringify({ resumeUrl }) }, token),
};
