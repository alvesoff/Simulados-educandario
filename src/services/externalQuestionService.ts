import axios from 'axios';

// Tipos para a API externa
export interface ExternalQuestion {
  id: string;
  statement: string;
  alternatives: string[];
  correctAnswer: number;
  disciplina: string;
  anoEscolar: number;
  nivelDificuldade: string;
  tags: string[];
  has_math: boolean;
}

export interface ExternalApiResponse {
  items: ExternalQuestion[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ExternalQuestionFilters {
  page?: number;
  limit?: number;
  search?: string;
  disciplina?: string;
  nivelDificuldade?: string;
  anoEscolar?: number;
  tags?: string;
}

// Função para converter questão externa para o formato interno
export const convertExternalQuestion = (externalQuestion: ExternalQuestion) => {
  // Preservar HTML mas decodificar entities básicas
  const preserveHtml = (html: string) => {
    return html
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  // Converter dificuldade
  const convertDifficulty = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return 'EASY';
      case 'médio':
      case 'medio':
        return 'MEDIUM';
      case 'difícil':
      case 'dificil':
        return 'HARD';
      default:
        return 'MEDIUM';
    }
  };

  // Converter alternativas para o formato de opções
  const options = externalQuestion.alternatives.map((alt, index) => ({
    text: preserveHtml(alt),
    isCorrect: index === externalQuestion.correctAnswer
  }));

  return {
    id: externalQuestion.id,
    statement: preserveHtml(externalQuestion.statement),
    options: options,
    type: 'MULTIPLE_CHOICE' as const,
    subject: externalQuestion.disciplina,
    grade: externalQuestion.anoEscolar,
    difficulty: convertDifficulty(externalQuestion.nivelDificuldade),
    tags: externalQuestion.tags,
    hasMath: externalQuestion.has_math,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: {
      id: 'external',
      name: 'API Externa'
    }
  };
};

export const externalQuestionService = {
  // Buscar questões da API externa
  getQuestions: async (filters?: ExternalQuestionFilters) => {
    console.log('🔄 [EXTERNAL_API] Iniciando busca de questões na API externa');
    console.log('📋 [EXTERNAL_API] Filtros aplicados:', filters);
    
    try {
      const params = new URLSearchParams();
      
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.disciplina) params.append('disciplina', filters.disciplina);
      if (filters?.nivelDificuldade) params.append('nivelDificuldade', filters.nivelDificuldade);
      if (filters?.anoEscolar) params.append('anoEscolar', filters.anoEscolar.toString());
      if (filters?.tags) params.append('tags', filters.tags);

      const url = `https://api-questao-1.onrender.com/api/v1/questoes?${params.toString()}`;
      console.log('🌐 [EXTERNAL_API] URL da requisição:', url);
      console.log('📤 [EXTERNAL_API] Parâmetros da query:', Object.fromEntries(params));

      const response = await axios.get<ExternalApiResponse>(url);

      console.log('✅ [EXTERNAL_API] Resposta recebida com sucesso');
      console.log('📊 [EXTERNAL_API] Status da resposta:', response.status);
      console.log('📥 [EXTERNAL_API] Headers da resposta:', response.headers);
      console.log('📋 [EXTERNAL_API] Dados brutos da API externa:', response.data);
      
      if (response.data && response.data.items) {
        console.log('📊 [EXTERNAL_API] Quantidade de questões recebidas:', response.data.items.length);
        console.log('📋 [EXTERNAL_API] Primeira questão (exemplo):', response.data.items[0]);
        console.log('📋 [EXTERNAL_API] Paginação:', response.data.pagination);
      }

      // Converter questões para o formato interno
      console.log('🔄 [EXTERNAL_API] Iniciando conversão das questões para formato interno');
      const convertedQuestions = response.data.items.map((question, index) => {
        try {
          const converted = convertExternalQuestion(question);
          if (index === 0) {
            console.log('📋 [EXTERNAL_API] Primeira questão convertida (exemplo):', converted);
          }
          return converted;
        } catch (conversionError) {
          console.error(`❌ [EXTERNAL_API] Erro ao converter questão ${index}:`, conversionError);
          console.error('📋 [EXTERNAL_API] Questão original que causou erro:', question);
          throw conversionError;
        }
      });
      console.log('✅ [EXTERNAL_API] Conversão concluída com sucesso');

      // Filtrar por busca se fornecida (a API externa pode não suportar busca)
      let filteredQuestions = convertedQuestions;
      if (filters?.search) {
        console.log('🔍 [EXTERNAL_API] Aplicando filtro de busca:', filters.search);
        const searchTerm = filters.search.toLowerCase();
        filteredQuestions = convertedQuestions.filter(q => 
          q.statement.toLowerCase().includes(searchTerm) ||
          q.subject.toLowerCase().includes(searchTerm)
        );
        console.log('📊 [EXTERNAL_API] Questões após filtro de busca:', filteredQuestions.length);
      }

      const result = {
        success: true,
        data: filteredQuestions,
        pagination: {
          page: response.data.pagination.currentPage,
          limit: response.data.pagination.pageSize,
          total: response.data.pagination.totalItems,
          totalPages: response.data.pagination.totalPages
        }
      };

      console.log('✅ [EXTERNAL_API] Resultado final preparado:', {
        success: result.success,
        questionsCount: result.data.length,
        pagination: result.pagination
      });

      return result;
    } catch (error) {
      console.error('❌ [EXTERNAL_API] Erro ao buscar questões da API externa:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('📊 [EXTERNAL_API] Status do erro:', error.response?.status);
        console.error('📋 [EXTERNAL_API] Dados do erro:', error.response?.data);
        console.error('📥 [EXTERNAL_API] Headers do erro:', error.response?.headers);
        console.error('🌐 [EXTERNAL_API] URL que causou erro:', error.config?.url);
        console.error('📤 [EXTERNAL_API] Método da requisição:', error.config?.method);
        
        if (error.code) {
          console.error('🔧 [EXTERNAL_API] Código do erro:', error.code);
        }
        
        if (error.message) {
          console.error('💬 [EXTERNAL_API] Mensagem do erro:', error.message);
        }
      } else {
        console.error('❌ [EXTERNAL_API] Erro não relacionado ao Axios:', error);
      }
      
      throw new Error('Erro ao carregar questões da API externa');
    }
  },

  // Obter disciplinas únicas
  getSubjects: async () => {
    console.log('🔄 [EXTERNAL_API] Iniciando busca de disciplinas na API externa');
    
    try {
      // Buscar uma amostra de questões para extrair as disciplinas
      const url = 'https://api-questao-1.onrender.com/api/v1/questoes?page=1&limit=1000';
      console.log('🌐 [EXTERNAL_API] URL para buscar disciplinas:', url);
      
      const response = await axios.get<ExternalApiResponse>(url);
      
      console.log('✅ [EXTERNAL_API] Resposta recebida para disciplinas');
      console.log('📊 [EXTERNAL_API] Status:', response.status);
      console.log('📊 [EXTERNAL_API] Total de questões para extrair disciplinas:', response.data.items.length);

      const subjects = [...new Set(response.data.items.map(q => q.disciplina))];
      console.log('📋 [EXTERNAL_API] Disciplinas encontradas:', subjects);
      
      const result = {
        success: true,
        data: subjects.sort()
      };
      
      console.log('✅ [EXTERNAL_API] Disciplinas processadas com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ [EXTERNAL_API] Erro ao buscar disciplinas da API externa:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('📊 [EXTERNAL_API] Status do erro (disciplinas):', error.response?.status);
        console.error('📋 [EXTERNAL_API] Dados do erro (disciplinas):', error.response?.data);
        console.error('💬 [EXTERNAL_API] Mensagem do erro (disciplinas):', error.message);
      }
      
      const fallbackResult = {
        success: true,
        data: ['Português', 'Matemática', 'História', 'Geografia', 'Ciências']
      };
      
      console.log('🔄 [EXTERNAL_API] Usando disciplinas padrão como fallback:', fallbackResult);
      return fallbackResult;
    }
  },

  // Obter anos escolares únicos
  getGrades: async () => {
    console.log('🔄 [EXTERNAL_API] Iniciando busca de anos escolares na API externa');
    
    try {
      const url = 'https://api-questao-1.onrender.com/api/v1/questoes?page=1&limit=1000';
      console.log('🌐 [EXTERNAL_API] URL para buscar anos escolares:', url);
      
      const response = await axios.get<ExternalApiResponse>(url);
      
      console.log('✅ [EXTERNAL_API] Resposta recebida para anos escolares');
      console.log('📊 [EXTERNAL_API] Status:', response.status);
      console.log('📊 [EXTERNAL_API] Total de questões para extrair anos:', response.data.items.length);

      const grades = [...new Set(response.data.items.map(q => q.anoEscolar))];
      console.log('📋 [EXTERNAL_API] Anos escolares encontrados:', grades);
      
      const result = {
        success: true,
        data: grades.sort((a, b) => a - b)
      };
      
      console.log('✅ [EXTERNAL_API] Anos escolares processados com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ [EXTERNAL_API] Erro ao buscar anos escolares da API externa:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('📊 [EXTERNAL_API] Status do erro (anos):', error.response?.status);
        console.error('📋 [EXTERNAL_API] Dados do erro (anos):', error.response?.data);
        console.error('💬 [EXTERNAL_API] Mensagem do erro (anos):', error.message);
      }
      
      const fallbackResult = {
        success: true,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      };
      
      console.log('🔄 [EXTERNAL_API] Usando anos escolares padrão como fallback:', fallbackResult);
      return fallbackResult;
    }
  },

  // Obter tags únicas
  getTags: async () => {
    console.log('🔄 [EXTERNAL_API] Iniciando busca de tags na API externa');
    
    try {
      const url = 'https://api-questao-1.onrender.com/api/v1/questoes?page=1&limit=1000';
      console.log('🌐 [EXTERNAL_API] URL para buscar tags:', url);
      
      const response = await axios.get<ExternalApiResponse>(url);
      
      console.log('✅ [EXTERNAL_API] Resposta recebida para tags');
      console.log('📊 [EXTERNAL_API] Status:', response.status);
      console.log('📊 [EXTERNAL_API] Total de questões para extrair tags:', response.data.items.length);

      // Extrair todas as tags de todas as questões
      const allTags = response.data.items.reduce((tags: string[], question) => {
        if (question.tags && Array.isArray(question.tags)) {
          tags.push(...question.tags);
        }
        return tags;
      }, []);
      
      // Remover duplicatas e ordenar
      const uniqueTags = [...new Set(allTags)].filter(tag => tag && tag.trim());
      console.log('📋 [EXTERNAL_API] Tags encontradas:', uniqueTags);
      
      const result = {
        success: true,
        data: uniqueTags.sort()
      };
      
      console.log('✅ [EXTERNAL_API] Tags processadas com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ [EXTERNAL_API] Erro ao buscar tags da API externa:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('📊 [EXTERNAL_API] Status do erro (tags):', error.response?.status);
        console.error('📋 [EXTERNAL_API] Dados do erro (tags):', error.response?.data);
        console.error('💬 [EXTERNAL_API] Mensagem do erro (tags):', error.message);
      }
      
      const fallbackResult = {
        success: true,
        data: []
      };
      
      console.log('🔄 [EXTERNAL_API] Usando lista vazia de tags como fallback:', fallbackResult);
      return fallbackResult;
    }
  }
};