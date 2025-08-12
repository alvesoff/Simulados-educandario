import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  EyeIcon,
  ShareIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { testService } from '../services/testService';
import { Test } from '../types/test';
import { toast } from 'react-hot-toast';
import QuestionSelector from '../components/QuestionSelector';
import TestQuestionList from '../components/TestQuestionList';
import PublishSuccessModal from '../components/PublishSuccessModal';

const EditTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadTest();
    }
  }, [id]);

  const loadTest = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const response = await testService.getTestById(id);
      
      // A API retorna diretamente o objeto da prova
      if (response && response.id) {
        setTest(response);
      } else {
        toast.error('Erro ao carregar prova');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro ao carregar prova:', error);
      toast.error('Erro ao carregar prova');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async (questionId: string, points: number, questionData?: any) => {
    if (!id) return;
    
    try {
      let response;
      
      // Se temos dados da questão (questão externa), usar o novo método
      if (questionData) {
        console.log('🔄 [EDIT_TEST] Adicionando questão externa com dados completos');
        console.log('📋 [EDIT_TEST] Dados da questão:', questionData);
        response = await testService.addExternalQuestionToTest(id, questionData, points);
      } else {
        // Caso contrário, usar o método antigo (questões internas)
        console.log('🔄 [EDIT_TEST] Adicionando questão interna por ID');
        response = await testService.addQuestionToTest(id, questionId, points);
      }
      
      // Para operações que não retornam dados, assumimos sucesso se não houve erro
      toast.success('Questão adicionada com sucesso!');
      await loadTest(); // Recarrega a prova para atualizar a lista
      
      // Fechar e reabrir o modal para atualizar a lista de questões disponíveis
      setShowQuestionSelector(false);
      setTimeout(() => setShowQuestionSelector(true), 100);
    } catch (error: any) {
      console.error('Erro ao adicionar questão:', error);
      toast.error(error.response?.data?.message || 'Erro ao adicionar questão');
    }
  };

  const handleRemoveQuestion = async (questionId: string) => {
    if (!id) return;
    
    try {
      const response = await testService.removeQuestionFromTest(id, questionId);
      // Para operações que não retornam dados, assumimos sucesso se não houve erro
      toast.success('Questão removida com sucesso!');
      loadTest(); // Recarrega a prova para atualizar a lista
    } catch (error: any) {
      console.error('Erro ao remover questão:', error);
      toast.error(error.response?.data?.message || 'Erro ao remover questão');
    }
  };

  const handleUpdatePoints = async (questionId: string, points: number) => {
    if (!id) return;
    
    try {
      const response = await testService.updateQuestionPoints(id, questionId, points);
      // Para operações que não retornam dados, assumimos sucesso se não houve erro
      toast.success('Pontuação atualizada!');
      loadTest(); // Recarrega a prova para atualizar a lista
    } catch (error: any) {
      console.error('Erro ao atualizar pontuação:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar pontuação');
    }
  };

  const handlePublishTest = async () => {
    if (!id || !test) return;
    
    if (test.questionsCount === 0) {
      toast.error('Adicione pelo menos uma questão antes de publicar');
      return;
    }
    
    try {
      const response = await testService.publishTest(id);
      // A API retorna diretamente o objeto da prova atualizada
      if (response && response.id) {
        setTest(response);
        // Mostrar modal de sucesso com o código de acesso
        setShowPublishSuccessModal(true);
      } else {
        toast.error('Erro ao publicar prova');
      }
    } catch (error: any) {
      console.error('Erro ao publicar prova:', error);
      toast.error(error.response?.data?.message || 'Erro ao publicar prova');
    }
  };

  const handleShowAccessCode = async () => {
    if (test?.accessCode) {
      try {
        // Tenta copiar o código para a área de transferência
        await navigator.clipboard.writeText(test.accessCode);
        toast.success(`✅ Código copiado para área de transferência: ${test.accessCode}`, {
          duration: 4000,
        });
      } catch (error) {
        // Se falhar ao copiar, ainda mostra o código
        toast.success(`📋 Código de acesso: ${test.accessCode}`, {
          duration: 4000,
        });
      }
    } else {
      toast.info('ℹ️ O código de acesso será gerado automaticamente quando a prova for publicada', {
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando prova...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Prova não encontrada</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {test.title}
                </h1>
                <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      test.status === 'EDITING' ? 'bg-yellow-400' :
                      test.status === 'ACTIVE' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></span>
                    {test.status === 'EDITING' ? 'Em Edição' :
                     test.status === 'ACTIVE' ? 'Ativa' : 'Finalizada'}
                  </span>
                  <span>{test.questionsCount} questões</span>
                  <span>{test.totalPoints} pontos</span>
                  {test.duration && <span>{test.duration} min</span>}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Voltar
                </button>
                
                {test.status === 'EDITING' && (
                  <>
                    <button
                      onClick={handleShowAccessCode}
                      className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">
                        {test?.accessCode ? 'Copiar Código' : 'Ver Código'}
                      </span>
                      <span className="sm:hidden">Código</span>
                    </button>
                    
                    <button
                      onClick={handlePublishTest}
                      disabled={test.questionsCount === 0}
                      className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Publicar</span>
                      <span className="sm:hidden">Pub</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de Questões da Prova */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Questões da Prova ({test.questionsCount})
                  </h2>
                  
                  {test.status === 'EDITING' && (
                    <button
                      onClick={() => setShowQuestionSelector(true)}
                      className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Adicionar Questão</span>
                      <span className="sm:hidden">Adicionar</span>
                    </button>
                  )}
                </div>

                <TestQuestionList
                  test={test}
                  onRemoveQuestion={handleRemoveQuestion}
                  onUpdatePoints={handleUpdatePoints}
                  readOnly={test.status !== 'EDITING'}
                />
              </div>
            </div>
          </div>

          {/* Informações e Configurações */}
          <div className="space-y-6">
            {/* Informações da Prova */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informações
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Tipo:</span>
                    <span className="ml-2 text-gray-600">
                      {test.type === 'PRIVATE' ? 'Privada' : 'Colaborativa'}
                    </span>
                  </div>
                  
                  {test.description && (
                    <div>
                      <span className="font-medium text-gray-700">Descrição:</span>
                      <p className="mt-1 text-gray-600 leading-relaxed">
                        {test.description}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-gray-700">Criado em:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(test.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Criado por:</span>
                    <span className="ml-2 text-gray-600">
                      {test.createdBy.name}
                    </span>
                  </div>
                  
                  {test.accessCode && (
                    <div>
                      <span className="font-medium text-gray-700">Código de Acesso:</span>
                      <span className="ml-2 font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {test.accessCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configurações
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Duração:</span>
                    <span className="text-gray-600">
                      {test.duration ? `${test.duration} min` : 'Sem limite'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tentativas:</span>
                    <span className="text-gray-600">{test.maxAttempts}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Mostrar resultados:</span>
                    <span className={`text-sm ${test.showResults ? 'text-green-600' : 'text-red-600'}`}>
                      {test.showResults ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Embaralhar questões:</span>
                    <span className={`text-sm ${test.shuffleQuestions ? 'text-green-600' : 'text-red-600'}`}>
                      {test.shuffleQuestions ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Embaralhar opções:</span>
                    <span className={`text-sm ${test.shuffleOptions ? 'text-green-600' : 'text-red-600'}`}>
                      {test.shuffleOptions ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Questões */}
      {showQuestionSelector && (
        <QuestionSelector
          onClose={() => setShowQuestionSelector(false)}
          onAddQuestion={handleAddQuestion}
          excludeQuestionIds={test.questions?.map(q => q.question.id) || []}
        />
      )}

      {/* Modal de Sucesso da Publicação */}
      {showPublishSuccessModal && test?.accessCode && (
        <PublishSuccessModal
          isOpen={showPublishSuccessModal}
          onClose={() => setShowPublishSuccessModal(false)}
          accessCode={test.accessCode}
        />
      )}
    </div>
  );
};

export default EditTestPage;