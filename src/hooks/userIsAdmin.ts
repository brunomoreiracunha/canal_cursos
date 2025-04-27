import { useAuth } from '../contexts/AuthContext';

export function useIsAdmin() {
  const { user } = useAuth();

  // Retorna true se o usuário logado for admin (tipo === 1 ou '1')
  return !!user && (user.tipo === 1);
}