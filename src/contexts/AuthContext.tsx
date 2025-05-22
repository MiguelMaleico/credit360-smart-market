
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

// Mock de autenticação com dados simulados
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'usuario@email.com',
    password: 'senha123',
    role: 'user' as const,
    profilePicture: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Banco Exemplo',
    email: 'parceiro@email.com',
    password: 'senha123',
    role: 'partner' as const,
    profilePicture: 'https://i.pravatar.cc/150?img=2'
  }
];

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  token: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  useEffect(() => {
    // Verifica se há um token no localStorage
    const token = localStorage.getItem('credito360_token');
    const userJson = localStorage.getItem('credito360_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        setState({
          ...state,
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('credito360_token');
        localStorage.removeItem('credito360_user');
        setState({
          ...initialState,
          isLoading: false
        });
      }
    } else {
      setState({
        ...initialState,
        isLoading: false
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setState({ ...state, isLoading: true, error: null });

    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Gerar token simulado
      const token = `mock_token_${Math.random().toString(36).substring(2, 15)}`;
      
      // Remover senha antes de armazenar
      const { password, ...userWithoutPassword } = user;

      localStorage.setItem('credito360_token', token);
      localStorage.setItem('credito360_user', JSON.stringify(userWithoutPassword));

      setState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token
      });

      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo(a), ${userWithoutPassword.name}!`,
        variant: 'default',
      });

    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer login'
      });

      toast({
        title: 'Erro ao fazer login',
        description: error instanceof Error ? error.message : 'Credenciais inválidas',
        variant: 'destructive',
      });
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setState({ ...state, isLoading: true, error: null });

    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verifica se o e-mail já está em uso
      const existingUser = mockUsers.find(u => u.email === credentials.email);
      if (existingUser) {
        throw new Error('E-mail já está em uso');
      }

      // Criar novo usuário (apenas simulado, não persiste entre reloads)
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        profilePicture: `https://i.pravatar.cc/150?img=${mockUsers.length + 1}`
      };

      // Gerar token simulado
      const token = `mock_token_${Math.random().toString(36).substring(2, 15)}`;

      localStorage.setItem('credito360_token', token);
      localStorage.setItem('credito360_user', JSON.stringify(newUser));

      setState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token
      });

      toast({
        title: 'Cadastro realizado com sucesso',
        description: `Bem-vindo(a), ${newUser.name}!`,
        variant: 'default',
      });

    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer cadastro'
      });

      toast({
        title: 'Erro ao fazer cadastro',
        description: error instanceof Error ? error.message : 'Não foi possível realizar o cadastro',
        variant: 'destructive',
      });
    }
  };

  const logout = (): void => {
    localStorage.removeItem('credito360_token');
    localStorage.removeItem('credito360_user');
    
    setState({
      ...initialState,
      isLoading: false
    });

    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
      variant: 'default',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
