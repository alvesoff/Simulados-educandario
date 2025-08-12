export interface Test {
  id: string;
  title: string;
  description?: string;
  type: 'PRIVATE' | 'COLLABORATIVE';
  status: 'EDITING' | 'ACTIVE' | 'COMPLETED';
  duration?: number;
  maxAttempts: number;
  showResults: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  accessCode?: string;
  totalPoints: number;
  questionsCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  school?: {
    id: string;
    name: string;
    code: string;
  };
  questions?: TestQuestion[];
  settings?: Record<string, any>;
}

export interface TestQuestion {
  id: string;
  points: number;
  orderNum: number;
  question: {
    id: string;
    statement: string;
    options: QuestionOption[];
    type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
    subject: string;
    topic?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    tags?: string[];
    hasMath: boolean;
  };
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  statement: string;
  options: QuestionOption[];
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  subject: string;
  topic?: string;
  grade?: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
  hasMath: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface CreateTestRequest {
  title: string;
  description?: string;
  type?: 'PRIVATE' | 'COLLABORATIVE';
  duration?: number;
  maxAttempts?: number;
  showResults?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  settings?: Record<string, any>;
}

export interface CreateQuestionRequest {
  statement: string;
  options: QuestionOption[];
  type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  subject: string;
  topic?: string;
  grade?: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
  hasMath?: boolean;
}

export interface TestFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export interface QuestionFilters {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  difficulty?: string;
  type?: string;
  tags?: string;
  grade?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}