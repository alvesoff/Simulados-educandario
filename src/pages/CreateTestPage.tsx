import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  DocumentTextIcon, 
  CogIcon, 
  UserGroupIcon,
  ClockIcon,
  EyeIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { testService } from '../services/testService';
import { CreateTestRequest } from '../types/test';
import { toast } from 'react-hot-toast';

const CreateTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTestRequest>({
    title: '',
    description: '',
    type: 'PRIVATE',
    duration: 60,
    maxAttempts: 1,
    showResults: true,
    shuffleQuestions: false,
    shuffleOptions: false,
    settings: {}
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : parseInt(value) || 1
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 handleSubmit iniciado');
    
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📤 Enviando dados para criação da prova:', formData);
      const response = await testService.createTest(formData);
      console.log('📦 Resposta completa do servidor:', response);
      console.log('📊 Tipo da resposta:', typeof response);
      console.log('🆔 response.id:', response.id);

      // A API retorna diretamente o objeto da prova, não uma estrutura ApiResponse
      if (response && response.id) {
        const targetUrl = `/tests/${response.id}/edit`;
        console.log('✅ Prova criada com sucesso, navegando para:', targetUrl);
        toast.success('Prova criada com sucesso!');
        
        console.log('🧭 Executando navigate...');
        console.log('🔍 Estado atual da aplicação antes do navigate:', {
          currentUrl: window.location.href,
          pathname: window.location.pathname,
          targetUrl
        });
        
        // Usar setTimeout para garantir que a navegação aconteça após o processamento
        setTimeout(() => {
          console.log('⏰ Executando navigate com delay...');
          console.log('🔍 Estado antes do navigate:', window.location.href);
          
          try {
            navigate(targetUrl);
            console.log('🧭 Navigate executado com delay');
            
            // Verificar se a navegação funcionou após um pequeno delay
            setTimeout(() => {
              console.log('🔍 Estado após navigate:', window.location.href);
              if (window.location.pathname !== targetUrl) {
                console.error('❌ Navegação com navigate falhou! Tentando com window.location.href...');
                console.log('🔄 Redirecionando com window.location.href para:', targetUrl);
                window.location.href = targetUrl;
              } else {
                console.log('✅ Navegação bem-sucedida!');
              }
            }, 200);
            
          } catch (error) {
            console.error('❌ Erro ao executar navigate:', error);
            console.log('🔄 Tentando redirecionamento com window.location.href...');
            window.location.href = targetUrl;
          }
        }, 100);
        
      } else {
        console.error('❌ Erro: Resposta não contém ID da prova');
        toast.error('Erro ao criar prova: resposta inválida');
      }
    } catch (error: any) {
      console.error('💥 Erro ao criar prova:', error);
      console.error('💥 error.response:', error.response);
      console.error('💥 error.response?.data:', error.response?.data);
      toast.error(error.response?.data?.message || 'Erro ao criar prova');
    } finally {
      console.log('🏁 handleSubmit finalizado, setIsLoading(false)');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Criar Nova Prova
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 leading-relaxed">
                Configure as informações básicas da sua prova
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Informações Básicas
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Título */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Título da Prova *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Ex: Prova de Matemática - 1º Bimestre"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Descrição (Opcional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none"
                    placeholder="Descreva o conteúdo e objetivos da prova..."
                  />
                </div>

                {/* Tipo de Prova */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Tipo de Prova
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="PRIVATE">Privada (Apenas você)</option>
                    <option value="COLLABORATIVE">Colaborativa (Com outros professores)</option>
                  </select>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {formData.type === 'PRIVATE' && 'Apenas você pode ver e editar esta prova'}
                    {formData.type === 'COLLABORATIVE' && 'Outros professores podem colaborar na criação'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <CogIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Configurações da Prova
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Duração */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    max="480"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="60"
                  />
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Deixe vazio para prova sem limite de tempo
                  </p>
                </div>

                {/* Tentativas */}
                <div>
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700">
                      <UserGroupIcon className="h-4 w-4 inline mr-1" />
                      Máximo de Tentativas
                    </label>
                    <div className="group relative">
                      <svg className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        Quantidade de vezes que o aluno pode realizar a prova
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    id="maxAttempts"
                    name="maxAttempts"
                    value={formData.maxAttempts || ''}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="1"
                  />
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Número de tentativas permitidas por aluno
                  </p>
                </div>
              </div>

              {/* Opções Avançadas */}
              <div className="mt-6 space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Opções Avançadas</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mostrar Resultados */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="showResults"
                        name="showResults"
                        type="checkbox"
                        checked={formData.showResults}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="showResults" className="font-medium text-gray-700 flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Mostrar Resultados
                      </label>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                        Alunos veem as respostas após finalizar
                      </p>
                    </div>
                  </div>

                  {/* Embaralhar Questões */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="shuffleQuestions"
                        name="shuffleQuestions"
                        type="checkbox"
                        checked={formData.shuffleQuestions}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="shuffleQuestions" className="font-medium text-gray-700 flex items-center">
                        <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
                        Embaralhar Questões
                      </label>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                        Ordem aleatória das questões
                      </p>
                    </div>
                  </div>

                  {/* Embaralhar Opções */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="shuffleOptions"
                        name="shuffleOptions"
                        type="checkbox"
                        checked={formData.shuffleOptions}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="shuffleOptions" className="font-medium text-gray-700 flex items-center">
                        <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
                        Embaralhar Opções
                      </label>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                        Ordem aleatória das alternativas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Criar Prova
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTestPage;