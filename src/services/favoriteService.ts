import type { Favorite } from '../types/favorite';
import { courseService } from './courseService';
import type { Course } from '../types/courseType';

class FavoriteService {
  private favorites: Favorite[] = [];

  constructor() {
    // Carrega favoritos do localStorage ao iniciar
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        this.favorites = JSON.parse(stored);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        this.favorites = [];
      }
    }
  }

  private saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  toggleFavorite(userId: number, courseId: number): boolean {
    const index = this.favorites.findIndex(
      f => f.userId === userId && f.courseId === courseId
    );

    if (index >= 0) {
      // Remove o favorito
      this.favorites.splice(index, 1);
      this.saveFavorites();
      return false; // Retorna false pois foi removido
    } else {
      // Adiciona o favorito
      this.favorites.push({
        userId,
        courseId,
        createdAt: new Date().toISOString()
      });
      this.saveFavorites();
      return true; // Retorna true pois foi adicionado
    }
  }

  isFavorite(userId: number, courseId: number): boolean {
    return this.favorites.some(
      f => f.userId === userId && f.courseId === courseId
    );
  }

  async getFavoritesByUser(userId: number): Promise<Course[]> {
    // Pega os IDs dos cursos favoritados
    const favoriteIds = this.favorites
      .filter(f => f.userId === userId)
      .map(f => f.courseId);

    // Retorna os produtos correspondentes
    return courseService.getAllCourses().then(courses =>
      courses.filter((course: Course) => favoriteIds.includes(course.id))
    );
  }
}

export const favoriteService = new FavoriteService();
