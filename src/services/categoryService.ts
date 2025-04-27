import { Category } from '../types/categoryType';
import { config } from '../config';

const API_URL = `${config.apiUrl}/categories.php`;

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      throw error;
    }
  },

  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}/?id=${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar categoria');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      throw error;
    }
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar categoria');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_URL}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...category, id }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar categoria');
    return await response.json();
  },

  deleteCategory: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir categoria');
  }
};
