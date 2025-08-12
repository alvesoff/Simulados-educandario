import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  clearError: () => void;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  console.log('🔄 [AuthReducer] Ação recebida:', action.type);
  console.log('🔄 [AuthReducer] Estado atual:', state);
  
  switch (action.type) {
    case 'AUTH_START':
      const startState = {
        ...state,
        isLoading: true,
        error: null,
      };
      console.log('🔄 [AuthReducer] AUTH_START - Novo estado:', startState);
      return startState;
    case 'AUTH_SUCCESS':
      const successState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      console.log('✅ [AuthReducer] AUTH_SUCCESS - Novo estado:', successState);
      return successState;
    case 'AUTH_ERROR':
      const errorState = {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
      console.log('❌ [AuthReducer] AUTH_ERROR - Novo estado:', errorState);
      return errorState;
    case 'AUTH_LOGOUT':
      const logoutState = {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
      console.log('🚪 [AuthReducer] AUTH_LOGOUT - Novo estado:', logoutState);
      return logoutState;
    case 'CLEAR_ERROR':
      const clearErrorState = {
        ...state,
        error: null,
      };
      console.log('🧹 [AuthReducer] CLEAR_ERROR - Novo estado:', clearErrorState);
      return clearErrorState;
    default:
      console.log('❓ [AuthReducer] Ação desconhecida:', action);
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar se há token salvo ao inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 [AuthContext] Inicializando autenticação...');
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      console.log('🔍 [AuthContext] Token encontrado:', !!token);
      console.log('🔍 [AuthContext] Usuário salvo encontrado:', !!savedUser);

      if (token && savedUser) {
        try {
          console.log('✅ [AuthContext] Verificando token com a API...');
          // Verificar se o token ainda é válido
          const response = await authService.verifyToken();
          console.log('📡 [AuthContext] Resposta da verificação:', response);
          
          if (response && response.user) {
            console.log('✅ [AuthContext] Token válido, fazendo login automático');
            dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
          } else {
            console.log('❌ [AuthContext] Token inválido, limpando dados');
            // Token inválido, limpar dados
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          console.log('❌ [AuthContext] Erro na verificação do token:', error);
          // Erro na verificação, limpar dados
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        console.log('🚫 [AuthContext] Nenhum token encontrado, fazendo logout');
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔄 [AuthContext] Iniciando processo de login...');
      dispatch({ type: 'AUTH_START' });

      console.log('📡 [AuthContext] Fazendo chamada para API de login...');
      const response = await authService.login({ email, password });
      console.log('📡 [AuthContext] Resposta da API de login:', response);

      // A API retorna os dados diretamente, não em um wrapper com success
      if (response && response.user && response.tokens) {
        console.log('✅ [AuthContext] Login bem-sucedido!');
        const { user, tokens } = response;
        console.log('👤 [AuthContext] Dados do usuário:', user);
        console.log('🔑 [AuthContext] Tokens recebidos:', { 
          hasAccessToken: !!tokens.accessToken, 
          hasRefreshToken: !!tokens.refreshToken 
        });

        // Salvar tokens e dados do usuário
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('💾 [AuthContext] Dados salvos no localStorage');

        console.log('🔄 [AuthContext] Disparando AUTH_SUCCESS...');
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        console.log('✅ [AuthContext] AUTH_SUCCESS disparado com sucesso');
        
        toast.success(`Bem-vindo(a), ${user.name}!`);
      } else {
        console.log('❌ [AuthContext] Login falhou - dados inválidos na resposta');
        console.log('📋 [AuthContext] Estrutura da resposta:', response);
      }
    } catch (error: any) {
      console.log('❌ [AuthContext] Erro no login:', error);
      const errorMessage = error.response?.data?.error?.message || 'Erro ao fazer login';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authService.register(userData);

      if (response && response.user && response.tokens) {
        const { user, tokens } = response;

        // Salvar tokens e dados do usuário
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        toast.success(`Conta criada com sucesso! Bem-vindo(a), ${user.name}!`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Erro ao criar conta';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar dados locais independentemente do resultado da API
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Logout realizado com sucesso!');
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};