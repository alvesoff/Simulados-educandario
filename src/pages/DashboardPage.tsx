import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, BarChart3, ClipboardList } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleCreateTest = () => {
    navigate('/tests/create');
  };

  const handleViewAllTests = () => {
    navigate('/tests');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Educa<span className="text-blue-600">Smart</span>
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {user?.name?.charAt(0) || 'P'}
                </div>
                <span className="text-xs sm:text-sm hidden sm:inline">{user?.name || 'Professor Demo'}</span>
                <span className="text-xs bg-gray-600 px-1 sm:px-2 py-1 rounded">
                  {user?.role === 'TEACHER' ? 'Prof' : 
                   user?.role === 'ADMIN' ? 'Admin' : 
                   user?.role === 'STAFF' ? 'Staff' : 'Prof'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Planeje Simulados
          </h2>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {/* Gerar Prova */}
          <div 
            onClick={handleCreateTest}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 xl:p-12 text-center hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FileText className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Gerar Prova</h3>
            <p className="text-sm sm:text-base lg:text-base xl:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
              Crie Provas de Forma Fácil e Simples Apenas Selecionando as Questões
            </p>
          </div>

          {/* Dashboard */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 xl:p-12 text-center hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <BarChart3 className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Dashboard</h3>
            <p className="text-sm sm:text-base lg:text-base xl:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
              Acompanhe o desempenho dos seus alunos
            </p>
          </div>

          {/* Todas as Provas */}
          <div 
            onClick={handleViewAllTests}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 xl:p-12 text-center hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ClipboardList className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Todas as Provas</h3>
            <p className="text-sm sm:text-base lg:text-base xl:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
              Veja e gerencie suas provas individuais
            </p>
          </div>
        </div>

        {/* Colored Letters */}
        <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4 flex-wrap gap-y-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl">
            A
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl">
            B
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl">
            C
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl">
            D
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl">
            E
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl">
            F
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl">
            G
          </div>
        </div>
      </main>
    </div>
  );
};