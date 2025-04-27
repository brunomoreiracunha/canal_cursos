import { Course } from '../types/courseType';
import { config } from '../config';
import { showToast } from '../utils/toast';

const API_URL = `${config.apiUrl}/courses.php`;

async function handleResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text || 'Erro desconhecido');
  }
}

function serializeLearningObjectives(learningObjectives: any[]) {
  // Se o backend espera items como string[]
  return learningObjectives.map(obj => ({
    ...obj,
    items: obj.items.map((i: any) => typeof i === 'string' ? i : i.item)
  }));
}


class CourseService {
  private courses: Course[] = [];

  constructor() {}

  
  async loadCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_URL}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar cursos');
      }
      this.courses = await response.json();
      return this.courses;
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      return [];
    }
  }

  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_URL}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar cursos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      return [];
    }
  }

  async getAllCoursesByFeatured(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_URL}/courses.php?featured=1`);
      if (!response.ok) {
        throw new Error('Erro ao carregar os cursos destacados');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar os cursos destacados:', error);
      return [];
    }
  }

  async getAllCoursesByCategoryId(categoryId: number): Promise<Course[]> {
    try {
      const response = await fetch(`${API_URL}/courses.php?category=${categoryId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar cursos por categoria');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar cursos por categoria:', error);
      return [];
    }
  }

  async getCourseById(id: number | string): Promise<Course | null> {
    try {
      const response = await fetch(`${API_URL}/courses.php?id=${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar curso');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
      return null;
    }
  }

  async addCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (!response.ok) {
        throw new Error('Erro ao criar curso');
      }
      const newCourse = await response.json();
      newCourse.id = this.courses.length > 0 ? Math.max(...this.courses.map(c => c.id)) + 1 : 1;
      this.courses.push(newCourse);
      return newCourse;
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      throw error;
    }
  }

  async updateCourse(id: number, data: Course) {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });      
      if (!response.ok) {
        showToast('Erro ao atualizar curso:', 'error');
        throw new Error('Erro ao atualizar curso');
      }
      return response.json();
    } catch (error) {
      showToast('Erro ao atualizar curso:', 'error');
      throw error;
    }
  }

  async removeCourse(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        console.error(`Erro ao excluir curso com id ${id}: ${response.status} ${response.statusText}`);
        return false;
      }
      this.courses = this.courses.filter(course => course.id !== id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      return false;
    }
  }

  async searchCourses(searchTerm: string): Promise<Course[]> {
    try {
      const response = await fetch(`${API_URL}?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar cursos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      return [];
    }
  }

  async searchCoursesByCategory(searchTerm: string, categoryId: number): Promise<Course[]> {
    try {
      const response = await fetch(`${API_URL}?category_id=${categoryId}&search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar os Cursos da Categoria');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar os Cursos da Categoria:', error);
      return [];
    }
  }
}

export const courseService = new CourseService();
