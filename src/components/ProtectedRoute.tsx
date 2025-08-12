import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'TEACHER' | 'ADMIN' | 'STAFF';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.log('🛡️ [ProtectedRoute] Estado atual:', {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    userRole: user?.role,
    requiredRole,
    currentPath: location.pathname
  });

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    console.log('⏳ [ProtectedRoute] Mostrando tela de loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    console.log('🚫 [ProtectedRoute] Usuário não autenticado, redirecionando para login...');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permissão de role se especificada
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};