import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { testService } from '../services/testService';
import { Test, TestFilters } from '../types/test';
import { toast } from 'react-hot-toast';

const TestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState<TestFilters>({
    page: 1,
    limit: 12,
    search: '',
    status: '',
    type: ''
  });

  useEffect(() => {
    loadTests();
  }, [filters]);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      const response = await testService.getTests(filters);
      // A API retorna diretamente os dados das provas
      if (response && Array.isArray(response.data)) {
        setTests(response.data);
        setPagination(response.pagination);
      } else {
        toast.error('Erro ao carregar provas');
      }
    } catch (error: any) {
      console.error('Erro ao carregar provas:', error);
      toast.error('Erro ao carregar provas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handleFilterChange = (key: keyof TestFilters, value: string) => {
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

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta prova?')) {
      return;
    }

    try {
      const response = await testService.deleteTest(testId);
      // Para operações de delete, assumimos sucesso se não houve erro
      toast.success('Prova excluída com sucesso!');
      loadTests();
    } catch (error: any) {
      console.error('Erro ao excluir prova:', error);
      toast.error(error.response?.data?.message || 'Erro ao excluir prova');
    }
  };

  const handleDuplicateTest = async (testId: string) => {
    try {
      const response = await testService.duplicateTest(testId);
      // A API retorna diretamente o objeto da prova duplicada
      if (response && response.id) {
        toast.success('Prova duplicada com sucesso!');
        navigate(`/tests/${response.id}/edit`);
      } else {
        toast.error('Erro ao duplicar prova');
      }
    } catch (error: any) {
      console.error('Erro ao duplicar prova:', error);
      toast.error(error.response?.data?.message || 'Erro ao duplicar prova');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EDITING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'ACTIVE': return 'text-green-600 bg-green-50 border-green-200';
      case 'COMPLETED': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'EDITING': return 'Em Edição';
      case 'ACTIVE': return 'Ativa';
      case 'COMPLETED': return 'Finalizada';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'PRIVATE': return 'Privada';
      case 'COLLABORATIVE': return 'Colaborativa';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Minhas Provas
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 leading-relaxed">
                Gerencie todas as suas provas em um só lugar
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Dashboard
              </button>
              
              <button
                onClick={() => navigate('/tests/create')}
                className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Nova Prova</span>
                <span className="sm:hidden">Nova</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
          <div className="px-4 py-4 sm:px-6">
            <div className="space-y-4">
              {/* Busca */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar provas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
                  >
                    Buscar
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-3 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors ${
                      showFilters 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>

              {/* Filtros Expandidos */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todos os status</option>
                      <option value="EDITING">Em Edição</option>
                      <option value="ACTIVE">Ativa</option>
                      <option value="COMPLETED">Finalizada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="PRIVATE">Privada</option>
                      <option value="COLLABORATIVE">Colaborativa</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({
                          page: 1,
                          limit: 12,
                          search: '',
                          status: '',
                          type: ''
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
        </div>

        {/* Lista de Provas */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando provas...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma prova encontrada</h3>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              {searchTerm || filters.status || filters.type 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Comece criando sua primeira prova.'
              }
            </p>
            {!searchTerm && !filters.status && !filters.type && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/tests/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Criar Primeira Prova
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Grid de Provas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {tests.map((test) => (
                <div key={test.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-4 sm:p-6">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {test.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(test.status)}`}>
                            {getStatusText(test.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Descrição */}
                    {test.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                        {test.description}
                      </p>
                    )}

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs sm:text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">{test.questionsCount}</div>
                        <div className="text-gray-600">Questões</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">{test.totalPoints}</div>
                        <div className="text-gray-600">Pontos</div>
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="space-y-1 mb-4 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Tipo:</span>
                        <span>{getTypeText(test.type)}</span>
                      </div>
                      {test.duration && (
                        <div className="flex justify-between">
                          <span>Duração:</span>
                          <span>{test.duration} min</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Criado em:</span>
                        <span>{new Date(test.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => navigate(`/tests/${test.id}/edit`)}
                        className="flex-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
                        title="Editar"
                      >
                        <PencilIcon className="h-3 w-3 mr-1" />
                        Editar
                      </button>
                      
                      <button
                        onClick={() => handleDuplicateTest(test.id)}
                        className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                        title="Duplicar"
                      >
                        <DocumentDuplicateIcon className="h-3 w-3" />
                      </button>
                      
                      {test.status === 'EDITING' && (
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                          title="Excluir"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} provas
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    {pagination.page} de {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestsPage;