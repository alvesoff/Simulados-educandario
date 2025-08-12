import api from './api';
import { 
  Test, 
  CreateTestRequest, 
  TestFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types/test';

export const testService = {
  // Criar teste
  createTest: async (data: CreateTestRequest): Promise<ApiResponse<Test>> => {
    const response = await api.post('/api/tests', data);
    return response.data;
  },

  // Listar testes
  getTests: async (filters?: TestFilters): Promise<PaginatedResponse<Test>> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);

    const response = await api.get(`/api/tests?${params.toString()}`);
    return response.data;
  },

  // Obter teste por ID
  getTestById: async (id: string): Promise<ApiResponse<Test>> => {
    const response = await api.get(`/api/tests/${id}`);
    return response.data;
  },

  // Atualizar teste
  updateTest: async (id: string, data: Partial<CreateTestRequest>): Promise<ApiResponse<Test>> => {
    const response = await api.put(`/api/tests/${id}`, data);
    return response.data;
  },

  // Deletar teste
  deleteTest: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/tests/${id}`);
    return response.data;
  },

  // Adicionar questão externa ao teste
  addExternalQuestionToTest: async (testId: string, questionData: any, points: number = 1): Promise<ApiResponse<void>> => {
    console.log('🔄 [ADD_EXTERNAL_QUESTION] Iniciando adição de questão externa à prova');
    console.log('📋 [ADD_EXTERNAL_QUESTION] Parâmetros:', { testId, questionData, points });
    
    try {
      // Preparar dados da questão externa
      let alternatives = [];
      let correctAnswer = 0;
      
      // Converter options para alternatives e correctAnswer se necessário
      if (questionData.options && Array.isArray(questionData.options)) {
        alternatives = questionData.options.map((option: any) => option.text || option);
        correctAnswer = questionData.options.findIndex((option: any) => option.isCorrect);
        if (correctAnswer === -1) correctAnswer = 0; // fallback
      } else if (questionData.alternatives) {
        alternatives = questionData.alternatives;
        correctAnswer = questionData.correctAnswer || 0;
      } else {
        throw new Error('Questão deve ter alternatives ou options');
      }
      
      const externalQuestion = {
        externalId: questionData.id || questionData.externalId,
        statement: questionData.statement || questionData.enunciado,
        alternatives: alternatives,
        correctAnswer: correctAnswer,
        subject: questionData.subject || questionData.materia || 'Geral',
        topic: questionData.topic || questionData.topico,
        difficulty: questionData.difficulty || questionData.dificuldade || 'MEDIUM',
        tags: questionData.tags || [],
        hasMath: questionData.hasMath || questionData.has_math || false,
        points: points
      };
      
      console.log('🔧 [ADD_EXTERNAL_QUESTION] Dados convertidos:', {
        originalOptions: questionData.options,
        convertedAlternatives: alternatives,
        convertedCorrectAnswer: correctAnswer
      });
      
      const payload = { questions: [externalQuestion] };
      console.log('📤 [ADD_EXTERNAL_QUESTION] Payload para API:', payload);
      console.log('🌐 [ADD_EXTERNAL_QUESTION] URL:', `/api/tests/${testId}/external-questions`);
      
      const response = await api.post(`/api/tests/${testId}/external-questions`, payload);
      console.log('✅ [ADD_EXTERNAL_QUESTION] Questão externa adicionada com sucesso');
      console.log('📥 [ADD_EXTERNAL_QUESTION] Resposta da API:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [ADD_EXTERNAL_QUESTION] Erro ao adicionar questão externa à prova:', error);
      console.error('📋 [ADD_EXTERNAL_QUESTION] Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
        stack: error.stack
      });
      
      if (error.response) {
        console.error('🌐 [ADD_EXTERNAL_QUESTION] Resposta do servidor:', error.response);
        console.error('📊 [ADD_EXTERNAL_QUESTION] Status HTTP:', error.response.status);
        console.error('📝 [ADD_EXTERNAL_QUESTION] Dados do erro:', error.response.data);
      } else if (error.request) {
        console.error('📡 [ADD_EXTERNAL_QUESTION] Erro de rede - sem resposta do servidor:', error.request);
      } else {
        console.error('⚙️ [ADD_EXTERNAL_QUESTION] Erro na configuração da requisição:', error.message);
      }
      
      throw error;
    }
  },

  // Adicionar questão ao teste (método antigo - mantido para compatibilidade)
  addQuestionToTest: async (testId: string, questionId: string, points: number): Promise<ApiResponse<void>> => {
    console.log('🔄 [ADD_QUESTION] Iniciando adição de questão à prova');
    console.log('📋 [ADD_QUESTION] Parâmetros:', { testId, questionId, points });
    
    try {
      const payload = { questionIds: [questionId] };
      console.log('📤 [ADD_QUESTION] Payload para API:', payload);
      console.log('🌐 [ADD_QUESTION] URL:', `/api/tests/${testId}/questions`);
      
      const response = await api.post(`/api/tests/${testId}/questions`, payload);
      console.log('✅ [ADD_QUESTION] Questão adicionada com sucesso');
      console.log('📥 [ADD_QUESTION] Resposta da API:', response.data);
      
      // Após adicionar a questão, atualizar os pontos se necessário
      if (points !== 1) {
        console.log('🔄 [UPDATE_POINTS] Atualizando pontos da questão');
        console.log('📋 [UPDATE_POINTS] Parâmetros:', { testId, questionId, points });
        
        try {
          await testService.updateQuestionPoints(testId, questionId, points);
          console.log('✅ [UPDATE_POINTS] Pontos atualizados com sucesso');
        } catch (pointsError: any) {
          console.error('❌ [UPDATE_POINTS] Erro ao atualizar pontos:', pointsError);
          console.error('📋 [UPDATE_POINTS] Detalhes do erro:', {
            message: pointsError.message,
            status: pointsError.response?.status,
            statusText: pointsError.response?.statusText,
            data: pointsError.response?.data,
            config: pointsError.config
          });
          // Não falha a operação principal se só os pontos falharem
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [ADD_QUESTION] Erro ao adicionar questão à prova:', error);
      console.error('📋 [ADD_QUESTION] Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
        stack: error.stack
      });
      
      if (error.response) {
        console.error('🌐 [ADD_QUESTION] Resposta do servidor:', error.response);
        console.error('📊 [ADD_QUESTION] Status HTTP:', error.response.status);
        console.error('📝 [ADD_QUESTION] Dados do erro:', error.response.data);
      } else if (error.request) {
        console.error('📡 [ADD_QUESTION] Erro de rede - sem resposta do servidor:', error.request);
      } else {
        console.error('⚙️ [ADD_QUESTION] Erro na configuração da requisição:', error.message);
      }
      
      throw error;
    }
  },

  // Remover questão do teste
  removeQuestionFromTest: async (testId: string, questionId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/tests/${testId}/questions/${questionId}`);
    return response.data;
  },

  // Atualizar pontuação da questão no teste
  updateQuestionPoints: async (testId: string, questionId: string, points: number): Promise<ApiResponse<void>> => {
    console.log('🔄 [UPDATE_POINTS] Iniciando atualização de pontos');
    console.log('📋 [UPDATE_POINTS] Parâmetros:', { testId, questionId, points });
    
    try {
      const payload = { points };
      console.log('📤 [UPDATE_POINTS] Payload para API:', payload);
      console.log('🌐 [UPDATE_POINTS] URL:', `/api/tests/${testId}/questions/${questionId}`);
      
      const response = await api.put(`/api/tests/${testId}/questions/${questionId}`, payload);
      console.log('✅ [UPDATE_POINTS] Pontos atualizados com sucesso');
      console.log('📥 [UPDATE_POINTS] Resposta da API:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [UPDATE_POINTS] Erro ao atualizar pontos da questão:', error);
      console.error('📋 [UPDATE_POINTS] Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
        stack: error.stack
      });
      
      if (error.response) {
        console.error('🌐 [UPDATE_POINTS] Resposta do servidor:', error.response);
        console.error('📊 [UPDATE_POINTS] Status HTTP:', error.response.status);
        console.error('📝 [UPDATE_POINTS] Dados do erro:', error.response.data);
      } else if (error.request) {
        console.error('📡 [UPDATE_POINTS] Erro de rede - sem resposta do servidor:', error.request);
      } else {
        console.error('⚙️ [UPDATE_POINTS] Erro na configuração da requisição:', error.message);
      }
      
      throw error;
    }
  },

  // Ativar teste (publicar)
  publishTest: async (id: string): Promise<ApiResponse<Test>> => {
    const response = await api.post(`/api/tests/${id}/activate`);
    return response.data;
  },

  // Duplicar teste
  duplicateTest: async (id: string): Promise<ApiResponse<Test>> => {
    const response = await api.post(`/api/tests/${id}/duplicate`);
    return response.data;
  },



  // Obter estatísticas do teste
  getTestStats: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/api/tests/${id}/stats`);
    return response.data;
  }
};