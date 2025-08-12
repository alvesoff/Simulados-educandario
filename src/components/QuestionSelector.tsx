import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { externalQuestionService, ExternalQuestionFilters } from '../services/externalQuestionService';
import { Question } from '../types/test';
import { toast } from 'react-hot-toast';
import SafeHtmlRenderer from './SafeHtmlRenderer';
import CreateQuestionModal from './CreateQuestionModal';

interface QuestionSelectorProps {
  onClose: () => void;
  onAddQuestion: (questionId: string, points: number, questionData?: any) => void;
  excludeQuestionIds?: string[];
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  onClose,
  onAddQuestion,
  excludeQuestionIds = []
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<{ [key: string]: number }>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState<ExternalQuestionFilters>({
    page: 1,
    limit: 10,
    search: '',
    disciplina: '',
    nivelDificuldade: '',
    anoEscolar: undefined,
    tags: ''
  });

  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);

  useEffect(() => {
    loadQuestions();
    loadSubjects();
    loadGrades();
    loadTags();
  }, [filters]);

  useEffect(() => {
    // Filtrar tags baseado no input do usuário
    if (filters.tags) {
      const searchTerm = filters.tags.toLowerCase();
      const filtered = availableTags.filter(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(availableTags);
    }
  }, [filters.tags, availableTags]);

  const loadQuestions = async () => {
    console.log('🔄 [QUESTION_SELECTOR] Iniciando carregamento de questões');
    console.log('📋 [QUESTION_SELECTOR] Filtros aplicados:', filters);
    console.log('📋 [QUESTION_SELECTOR] Questões excluídas:', excludeQuestionIds);
    
    setIsLoading(true);
    try {
      const response = await externalQuestionService.getQuestions(filters);
      console.log('📥 [QUESTION_SELECTOR] Resposta recebida do serviço:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        console.log('✅ [QUESTION_SELECTOR] Resposta válida recebida');
        console.log('📊 [QUESTION_SELECTOR] Total de questões antes do filtro:', response.data.length);
        
        // Filtrar questões já adicionadas à prova
        const filteredQuestions = response.data.filter(
          q => !excludeQuestionIds.includes(q.id)
        );
        
        console.log('📊 [QUESTION_SELECTOR] Questões após filtro de exclusão:', filteredQuestions.length);
        console.log('📋 [QUESTION_SELECTOR] Primeira questão filtrada (exemplo):', filteredQuestions[0]);
        
        setQuestions(filteredQuestions);
        setPagination(response.pagination);
        
        console.log('✅ [QUESTION_SELECTOR] Estado atualizado com sucesso');
        console.log('📊 [QUESTION_SELECTOR] Paginação:', response.pagination);
      } else {
        console.error('❌ [QUESTION_SELECTOR] Resposta inválida:', response);
        toast.error('Erro ao carregar questões');
      }
    } catch (error: any) {
      console.error('❌ [QUESTION_SELECTOR] Erro ao carregar questões:', error);
      console.error('💬 [QUESTION_SELECTOR] Mensagem do erro:', error.message);
      console.error('📋 [QUESTION_SELECTOR] Stack trace:', error.stack);
      toast.error('Erro ao carregar questões da API externa');
    } finally {
      setIsLoading(false);
      console.log('🏁 [QUESTION_SELECTOR] Carregamento finalizado');
    }
  };

  const loadSubjects = async () => {
    console.log('🔄 [QUESTION_SELECTOR] Carregando disciplinas');
    
    try {
      const response = await externalQuestionService.getSubjects();
      console.log('📥 [QUESTION_SELECTOR] Resposta de disciplinas:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        console.log('✅ [QUESTION_SELECTOR] Disciplinas carregadas:', response.data);
        setSubjects(response.data);
      } else {
        console.warn('⚠️ [QUESTION_SELECTOR] Resposta inesperada da API de matérias:', response);
        setSubjects([]);
      }
    } catch (error: any) {
      console.error('❌ [QUESTION_SELECTOR] Erro ao carregar matérias:', error);
      console.error('💬 [QUESTION_SELECTOR] Mensagem do erro:', error.message);
      toast.error('Erro ao carregar lista de matérias');
      setSubjects([]);
    }
  };

  const loadGrades = async () => {
    console.log('🔄 [QUESTION_SELECTOR] Carregando anos escolares');
    
    try {
      const response = await externalQuestionService.getGrades();
      console.log('📥 [QUESTION_SELECTOR] Resposta de anos escolares:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        console.log('✅ [QUESTION_SELECTOR] Anos escolares carregados:', response.data);
        setGrades(response.data);
      } else {
        console.warn('⚠️ [QUESTION_SELECTOR] Resposta inesperada da API de anos escolares:', response);
        setGrades([]);
      }
    } catch (error: any) {
      console.error('❌ [QUESTION_SELECTOR] Erro ao carregar anos escolares:', error);
      console.error('💬 [QUESTION_SELECTOR] Mensagem do erro:', error.message);
      toast.error('Erro ao carregar lista de anos escolares');
      setGrades([]);
    }
  };

  const loadTags = async () => {
    console.log('🔄 [QUESTION_SELECTOR] Carregando tags');
    
    try {
      const response = await externalQuestionService.getTags();
      console.log('📥 [QUESTION_SELECTOR] Resposta de tags:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        console.log('✅ [QUESTION_SELECTOR] Tags carregadas:', response.data);
        setAvailableTags(response.data);
      } else {
        console.warn('⚠️ [QUESTION_SELECTOR] Resposta inesperada da API de tags:', response);
        setAvailableTags([]);
      }
    } catch (error: any) {
      console.error('❌ [QUESTION_SELECTOR] Erro ao carregar tags:', error);
      console.error('💬 [QUESTION_SELECTOR] Mensagem do erro:', error.message);
      toast.error('Erro ao carregar lista de tags');
      setAvailableTags([]);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handleFilterChange = (key: keyof ExternalQuestionFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleAddQuestion = (questionId: string) => {
    const points = selectedPoints[questionId] || 1;
    const questionData = questions.find(q => q.id === questionId);
    
    console.log('🔄 [QUESTION_SELECTOR] Adicionando questão à prova');
    console.log('📋 [QUESTION_SELECTOR] ID da questão:', questionId);
    console.log('📊 [QUESTION_SELECTOR] Pontos atribuídos:', points);
    console.log('📋 [QUESTION_SELECTOR] Dados da questão:', questionData);
    console.log('📋 [QUESTION_SELECTOR] Todos os pontos configurados:', selectedPoints);
    
    try {
      onAddQuestion(questionId, points, questionData);
      console.log('✅ [QUESTION_SELECTOR] Questão adicionada com sucesso');
      toast.success('Questão adicionada à prova!');
      
      // Remove a questão da lista local
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      
      // Remove dos pontos selecionados
      setSelectedPoints(prev => {
        const newPoints = { ...prev };
        delete newPoints[questionId];
        return newPoints;
      });
    } catch (error) {
      console.error('❌ [QUESTION_SELECTOR] Erro ao adicionar questão:', error);
      toast.error('Erro ao adicionar questão à prova');
    }
  };

  const handlePointsChange = (questionId: string, points: number) => {
    setSelectedPoints(prev => ({
      ...prev,
      [questionId]: points
    }));
  };

  const handleTagSelect = (tag: string) => {
    handleFilterChange('tags', tag);
    setShowTagDropdown(false);
  };

  const handleTagInputChange = (value: string) => {
    handleFilterChange('tags', value);
    setShowTagDropdown(value.length > 0 && filteredTags.length > 0);
  };

  const handleTagInputFocus = () => {
    setShowTagDropdown(filteredTags.length > 0);
  };

  const handleTagInputBlur = () => {
    // Delay para permitir clique nas opções
    setTimeout(() => setShowTagDropdown(false), 200);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY': 
      case 'FÁCIL':
      case 'FACIL': 
        return 'text-green-600 bg-green-50';
      case 'MEDIUM': 
      case 'MÉDIO':
      case 'MEDIO': 
        return 'text-yellow-600 bg-yellow-50';
      case 'HARD': 
      case 'DIFÍCIL':
      case 'DIFICIL': 
        return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY': return 'Fácil';
      case 'MEDIUM': return 'Médio';
      case 'HARD': return 'Difícil';
      case 'FÁCIL':
      case 'FACIL': return 'Fácil';
      case 'MÉDIO':
      case 'MEDIO': return 'Médio';
      case 'DIFÍCIL':
      case 'DIFICIL': return 'Difícil';
      default: return difficulty;
    }
  };



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Selecionar Questões
                </h3>
                <button
                  onClick={() => setShowCreateQuestionModal(true)}
                  disabled={true}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 bg-gray-300 rounded-md cursor-not-allowed opacity-50 transition-colors"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Criar Questão</span>
                  <span className="sm:hidden">Criar</span>
                </button>
              </div>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="space-y-4">
              {/* Busca */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar questões..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
                  >
                    Buscar
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors ${
                      showFilters 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Filtros Expandidos */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-white rounded-md border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disciplina
                    </label>
                    <select
                      value={filters.disciplina || ''}
                      onChange={(e) => handleFilterChange('disciplina', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todas as disciplinas</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dificuldade
                    </label>
                    <select
                      value={filters.nivelDificuldade || ''}
                      onChange={(e) => handleFilterChange('nivelDificuldade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todas as dificuldades</option>
                      <option value="Fácil">Fácil</option>
                      <option value="Médio">Médio</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano Escolar
                    </label>
                    <select
                      value={filters.anoEscolar || ''}
                      onChange={(e) => handleFilterChange('anoEscolar', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todos os anos</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}º ano</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="Digite para buscar tags..."
                      value={filters.tags || ''}
                      onChange={(e) => handleTagInputChange(e.target.value)}
                      onFocus={handleTagInputFocus}
                      onBlur={handleTagInputBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    
                    {/* Dropdown de tags */}
                    {showTagDropdown && filteredTags.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredTags.slice(0, 10).map((tag, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleTagSelect(tag)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({
                          page: 1,
                          limit: 10,
                          search: '',
                          disciplina: '',
                          nivelDificuldade: '',
                          anoEscolar: undefined,
                          tags: ''
                        });
                        setSearchTerm('');
                      }}
                      className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lista de Questões */}
          <div className="bg-white px-4 py-4 sm:px-6 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando questões...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhuma questão encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {getDifficultyText(question.difficulty)}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                            {question.subject}
                          </span>
                          {question.grade && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-purple-600 bg-purple-50">
                              {question.grade}º ano
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                            Múltipla Escolha
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <SafeHtmlRenderer 
                            html={question.statement}
                            className="text-sm text-gray-900 leading-relaxed"
                          />
                        </div>
                        
                        {question.options && question.options.length > 0 && (
                          <div className="space-y-1">
                            {question.options.map((option, index) => (
                              <div key={index} className={`text-xs p-2 rounded ${option.isCorrect ? 'bg-green-50 text-green-700 font-medium' : 'bg-gray-50 text-gray-600'}`}>
                                <div className="flex items-start gap-2">
                                  <span className="font-medium flex-shrink-0">
                                    {String.fromCharCode(65 + index)})
                                  </span>
                                  <div className="flex-1">
                                    <SafeHtmlRenderer 
                                      html={option.text}
                                      className="text-xs"
                                    />
                                  </div>
                                  {option.isCorrect && (
                                    <span className="text-green-600 flex-shrink-0">✓</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:ml-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Pontos:
                          </label>
                          <input
                            type="number"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={selectedPoints[question.id] || 1}
                            onChange={(e) => handlePointsChange(question.id, parseFloat(e.target.value) || 1)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <button
                          onClick={() => handleAddQuestion(question.id)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} questões
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    {pagination.page} de {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto sm:ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Criação de Questão */}
      <CreateQuestionModal
        isOpen={showCreateQuestionModal}
        onClose={() => setShowCreateQuestionModal(false)}
        onQuestionCreated={(question) => {
          // Recarregar a lista de questões após criar uma nova
          loadQuestions();
          toast.success('Questão criada com sucesso!');
        }}
      />
    </div>
  );
};

export default QuestionSelector;