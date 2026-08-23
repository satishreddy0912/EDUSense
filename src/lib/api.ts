type ApiRecord = Record<string, unknown>;
type ApiResponse = ApiRecord | unknown[];
type Role = 'admin' | 'teacher' | 'student';
type QuizScope = {
  subject: string;
  className: string;
  chapter: string;
  topic: string;
};
type QuizQuestion = {
  id: number;
  type: string;
  text: string;
  answer: string;
  marks: number;
  source?: string;
};
type QuizListResponse = {
  questions?: QuizQuestion[];
  analytics?: {
    attempted: number;
    average: number;
    highest: number;
    lowest: number;
    passPercentage: number;
  };
  sources?: Array<{ id: string }>;
};
type AuthResponse = { token: string } & ApiRecord;
type DocumentPayload = {
  name: string;
  type: string;
  content: string;
  subject?: string;
  className?: string;
  chapter?: string;
  topic?: string;
  previousClassContent?: boolean;
};

type ApiError = { error?: string };

type AttendanceApiData = {
  overall: {
    totalClasses: number;
    present: number;
    absent: number;
    percentage: number;
  };
  subjects: Array<{
    subject: string;
    total: number;
    present: number;
    absent: number;
    percent: number;
  }>;
  monthly: Array<{
    month: string;
    attendance: number;
  }>;
};

const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api')).replace(/\/$/, '');

let authToken = localStorage.getItem('vidya_auth_token') || '';

async function request<T extends ApiResponse>(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers ? Object.fromEntries(new Headers(options.headers).entries()) : {}),
  };
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = (await response.json().catch(() => ({}) as T)) as T & ApiError;
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

export const api = {
  health: () => request<{ ok: boolean; database: string; ai: boolean }>('/health'),
  auth: {
    login: async (role: Role, identifier: string, password: string) => {
      const data = await request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ role, identifier, password }) });
      authToken = data.token;
      localStorage.setItem('vidya_auth_token', authToken);
      return data;
    },
    demo: async (role: Role = 'teacher', userId = 'teacher-001') => {
      const data = await request<AuthResponse>('/auth/demo', { method: 'POST', body: JSON.stringify({ role, userId }) });
      authToken = data.token;
      localStorage.setItem('vidya_auth_token', authToken);
      return data;
    },
    logout: () => {
      authToken = '';
      localStorage.removeItem('vidya_auth_token');
      localStorage.removeItem('vidya_auth_role');
      localStorage.removeItem('vidya_auth_user');
    },
  },
  parent: {
    requestOtp: (rollNumber: string, mobile: string) => request<ApiRecord>('/parent/request-otp', { method: 'POST', body: JSON.stringify({ rollNumber, mobile }) }),
    verifyOtp: async (rollNumber: string, otp: string) => {
      const data = await request<AuthResponse>('/parent/verify-otp', { method: 'POST', body: JSON.stringify({ rollNumber, otp }) });
      authToken = data.token;
      localStorage.setItem('vidya_auth_token', authToken);
      return data;
    },
    get: (roll: string) => request<ApiRecord>(`/parent/${encodeURIComponent(roll)}`),
    sendMessage: (roll: string, text: string) => request<ApiRecord>(`/parent/${encodeURIComponent(roll)}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
    requestMeeting: (roll: string, date: string, time: string) => request<ApiRecord>(`/parent/${encodeURIComponent(roll)}/meetings`, { method: 'POST', body: JSON.stringify({ date, time }) }),
  },
  attendance: () => request<AttendanceApiData>('/attendance'),
  documents: {
    list: () => request<ApiRecord[]>('/documents'),
    uploadText: (payload: DocumentPayload) => request<ApiRecord>('/documents', { method: 'POST', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiRecord>(`/documents/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  quizzes: {
    get: () => request<QuizListResponse>('/quizzes'),
    generate: (scope: QuizScope) => request<QuizListResponse>('/quizzes/generate', { method: 'POST', body: JSON.stringify(scope) }),
    add: (q: QuizQuestion) => request<QuizQuestion>('/quizzes', { method: 'POST', body: JSON.stringify(q) }),
    update: (id: number, q: Partial<QuizQuestion>) => request<QuizQuestion>(`/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(q) }),
    remove: (id: number) => request<ApiRecord>(`/quizzes/${id}`, { method: 'DELETE' }),
    publish: () => request<ApiRecord>('/quizzes/publish', { method: 'POST' }),
  },
  student: {
    dashboard: () => request<ApiRecord>('/student/dashboard'),
    assignments: () => request<ApiRecord[]>('/student/assignments'),
    submitAssignment: (payload: ApiRecord) => request<ApiRecord>('/student/assignments', { method: 'POST', body: JSON.stringify(payload) }),
  },
  insights: () => request<ApiRecord>('/student/insights'),
  notifications: () => request<ApiRecord[]>('/notifications'),
  lessons: {
    list: () => request<ApiRecord[]>('/lessons'),
    upload: (payload: ApiRecord) => request<ApiRecord>('/lessons', { method: 'POST', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiRecord>(`/lessons/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  handRaises: {
    list: () => request<ApiRecord[]>('/hand-raises'),
    acknowledge: (id: string) => request<ApiRecord>(`/hand-raises/${encodeURIComponent(id)}/acknowledge`, { method: 'POST' }),
  },
};
