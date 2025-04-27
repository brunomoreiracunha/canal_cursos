import { User, LoginResponse } from '../types/userType';

const API_URL = import.meta.env.VITE_API_URL; 

class UserService {
  // Opcional: cache local
  private users: User[] = [];

  // LOGIN
  async login(email: string, senha: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/users.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, senha }),
    });
    return await response.json();
  }

  // CADASTRO
  async register(nome: string, email: string, senha: string, tipo: string = 'aluno'): Promise<any> {
    const response = await fetch(`${API_URL}/users.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, tipo }),
    });
    return await response.json();
  }

  // BUSCAR USUÁRIO POR ID
  async getUserById(id: number): Promise<User | null> {
    const response = await fetch(`${API_URL}/users.php?id=${id}`);
    if (!response.ok) return null;
    return await response.json();
  }

  // BUSCAR TODOS OS USUÁRIOS
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users.php`);
    if (!response.ok) return [];
    return await response.json();
  }

  // ATUALIZAR USUÁRIO
  async updateUser(id: number, data: Partial<User> & { senha?: string }): Promise<any> {
    const response = await fetch(`${API_URL}/users.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    return await response.json();
  }

  // EXCLUIR USUÁRIO
  async deleteUser(id: number): Promise<any> {
    const response = await fetch(`${API_URL}/users.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return await response.json();
  }
}

// Exportando uma instância única (singleton)
const userService = new UserService();
export default userService;

/*// Logout
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Verifica se o usuário é admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}*/