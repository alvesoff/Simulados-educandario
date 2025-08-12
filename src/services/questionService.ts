import api from './api';
import { 
  Question, 
  CreateQuestionRequest, 
  QuestionFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types/test';

export const questionService = {
  // Criar questão
  createQuestion: async (data: CreateQuestionRequest): Promise<ApiResponse<Question>> => {
    const response = await api.post('/api/questions', data);
    return response.data;
  },

  // Listar questões
  getQuestions: async (filters?: QuestionFilters): Promise<PaginatedResponse<Question>> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.tags) params.append('tags', filters.tags);
    if (filters?.grade) params.append('grade', filters.grade.toString());

    const response = await api.get(`/api/questions?${params.toString()}`);
    return response.data;
  },

  // Obter questão por ID
  getQuestionById: async (id: string): Promise<ApiResponse<Question>> => {
    const response = await api.get(`/api/questions/${id}`);
    return response.data;
  },

  // Atualizar questão
  updateQuestion: async (id: string, data: Partial<CreateQuestionRequest>): Promise<ApiResponse<Question>> => {
    const response = await api.put(`/api/questions/${id}`, data);
    return response.data;
  },

  // Deletar questão
  deleteQuestion: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/questions/${id}`);
    return response.data;
  },

  // Obter matérias disponíveis
  getSubjects: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/api/questions/meta/subjects');
    return response.data;
  },

  // Obter tópicos por matéria
  getTopicsBySubject: async (subject: string): Promise<ApiResponse<string[]>> => {
    const response = await api.get(`/api/questions/meta/subjects/${subject}/topics`);
    return response.data;
  },

  // Obter tags disponíveis
  getTags: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/api/questions/tags');
    return response.data;
  },

  // Importar questões em lote
  importQuestions: async (file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/questions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Exportar questões
  exportQuestions: async (filters?: QuestionFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.tags) params.append('tags', filters.tags);
    if (filters?.grade) params.append('grade', filters.grade.toString());

    const response = await api.get(`/api/questions/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }
};