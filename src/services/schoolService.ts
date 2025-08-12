import api from './api';
import { School, CreateSchoolRequest } from '../types/school';

export const schoolService = {
  // Listar escolas ativas (público)
  async getActiveSchools(): Promise<{ success: boolean; data: School[] }> {
    const response = await api.get('/api/schools/active');
    return response.data;
  },

  // Listar escolas
  async getSchools(includeInactive?: boolean): Promise<{ success: boolean; data: School[] }> {
    const params = includeInactive ? '?includeInactive=true' : '';
    const response = await api.get(`/api/schools${params}`);
    return response.data;
  },

  // Obter escola por ID
  async getSchoolById(id: string): Promise<{ success: boolean; data: School }> {
    const response = await api.get(`/api/schools/${id}`);
    return response.data;
  },

  // Obter escola por código
  async getSchoolByCode(code: string): Promise<{ success: boolean; data: School }> {
    const response = await api.get(`/api/schools/code/${code}`);
    return response.data;
  },

  // Criar escola (apenas ADMIN)
  async createSchool(schoolData: CreateSchoolRequest): Promise<{ success: boolean; data: School }> {
    const response = await api.post('/api/schools', schoolData);
    return response.data;
  },

  // Atualizar escola
  async updateSchool(id: string, schoolData: Partial<CreateSchoolRequest>): Promise<{ success: boolean; data: School }> {
    const response = await api.put(`/api/schools/${id}`, schoolData);
    return response.data;
  },

  // Deletar escola
  async deleteSchool(id: string): Promise<void> {
    await api.delete(`/api/schools/${id}`);
  }
};