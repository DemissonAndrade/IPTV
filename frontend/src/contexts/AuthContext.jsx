import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api';

// Estado inicial
const initialState = {
  user: null,
  token: null,
  subscription: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Ações
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  VERIFY_START: 'VERIFY_START',
  VERIFY_SUCCESS: 'VERIFY_SUCCESS',
  VERIFY_FAILURE: 'VERIFY_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.VERIFY_START:
      return { ...state, isLoading: true, error: null };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.VERIFY_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        subscription: action.payload.subscription,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.VERIFY_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        subscription: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Contexto
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificação do token no carregamento
  useEffect(() => {
    let isMounted = true;
  
    async function verifyToken() {
      if (!isMounted) return;
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.VERIFY_FAILURE, payload: null });
        return;
      }
  
      try {
        dispatch({ type: AUTH_ACTIONS.VERIFY_START });
        // Chamada à API de verificação
        // Retorna o objeto completo para analisar o status HTTP
        const response = await authService.verifyTokenRaw();
  
        if (response.status === 200 && response.data?.user) {
          dispatch({
            type: AUTH_ACTIONS.VERIFY_SUCCESS,
            payload: {
              user: response.data.user,
              token,
              subscription: response.data.subscription || null,
            },
          });
        } else {
          throw new Error('Token inválido');
        }
      } catch (error) {
        console.error('AuthContext: verify error:', error);
  
        // Se erro de autenticação, limpar token e deslogar
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({
            type: AUTH_ACTIONS.VERIFY_FAILURE,
            payload: 'Sessão expirada. Faça login novamente.',
          });
        } else {
          // Outros erros: pode manter o estado ou limpar, depende da sua lógica
          dispatch({
            type: AUTH_ACTIONS.VERIFY_FAILURE,
            payload: error?.message || 'Erro ao verificar autenticação',
          });
        }
      }
    }
  
    verifyToken();
  
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Login
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const response = await authService.login(credentials);

      if (response?.success && response.data?.token) {
        const { token, user, subscription } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token, subscription },
        });

        return { success: true };
      } else {
        const errorMessage = response?.error || 'Erro no login';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error?.error || error?.message || 'Erro no login';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register (ajustado corretamente para frontend)
  const register = async (data) => {
    console.log('Register called with data:', data);
    const { nome, email, senha, planoId } = data;
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const response = await authService.register({ nome, email, senha, planoId });
      console.log('Response from authService.register:', response);

      if (response?.success && response.data?.token) {
        const { token, user, subscription } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token, subscription },
        });

        return { success: true };
      } else {
        throw new Error(response?.error || 'Erro no registro');
      }
    } catch (error) {
      const errorMessage = error?.error || error?.message || 'Erro no registro';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
