import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginForm } from '../components/LoginForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { useAuth } from '../contexts/AuthContext';

type FormMode = 'login' | 'forgot-password';

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const { isAuthenticated, isLoading } = useAuth();

  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleForgotPassword = () => {
    setMode('forgot-password');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Educa<span className="text-secondary-500">Smart</span>
            </h1>
            <p className="text-gray-600 mt-2">Sistema de Simulados Online</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card px-8 py-10">
            {mode === 'login' && (
              <LoginForm
                onForgotPassword={handleForgotPassword}
              />
            )}
            {mode === 'forgot-password' && (
              <ForgotPasswordForm onBack={handleBackToLogin} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 EducaSmart - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};