import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/userType';
import userService from '../services/userService'; // Corrija para import default
import { useToast } from './ToastContext';

interface AuthContextData {
  user: Omit<User, 'password'> | null;
  login: (email: string, password: string) => Promise<void>;
  register: (nome: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  showToast?: (message: string, type: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  login: async () => { throw new Error('Não foi possível iniciar o AuthContext'); },
  register: async () => { throw new Error('Não foi possível iniciar o AuthContext'); },
  logout: () => { throw new Error('Não foi possível iniciar o AuthContext'); },
  showToast: () => { throw new Error('Não foi possível iniciar o AuthContext'); }
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const { showToast } = useToast ? useToast() : { showToast: () => {} };

  // LOGIN
  const login = async (email: string, password: string) => {
    const result = await userService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      showToast && showToast('Login realizado com sucesso!', 'success');
    } else {
      showToast && showToast(result.error || 'Erro ao fazer login', 'error');
      throw new Error(result.error || 'Erro ao fazer login');
    }
  };

  // REGISTRO
  const register = async (nome: string, email: string, password: string) => {
    const result = await userService.register(nome, email, password);
    if (result.success) {
      showToast && showToast('Cadastro realizado com sucesso!', 'success');
    } else {
      showToast && showToast(result.error || 'Erro ao cadastrar', 'error');
      throw new Error(result.error || 'Erro ao cadastrar');
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    showToast && showToast('Logout realizado com sucesso!', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}