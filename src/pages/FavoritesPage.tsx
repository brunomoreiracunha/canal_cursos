import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CourseCard } from '../components/CourseCard';
import { favoriteService } from '../services/favoriteService';
import { Navigate } from 'react-router-dom';
import type { Course } from '../types/courseType';

export function FavoritesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteCourses, setFavoriteCourses] = useState<Course[]>([]);

  // Se não houver usuário logado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Carrega os favoritos quando a página é montada
  useEffect(() => {
    if (user) {
      favoriteService.getFavoritesByUser(user.id)
        .then(courses => {
          setFavoriteCourses(courses);
        })
        .catch(error => {
          console.error('Erro ao buscar favoritos:', error);
        });
    }
  }, [user]);

  const handleUnfavorite = (courseId: number) => {
    if (!user) return;
    setFavoriteCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const filteredCourses = favoriteCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        showSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        liveSearch
      />

      <div className="container mx-auto px-4 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Meus Favoritos</h1>
            <p className="text-gray-400">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'curso favorito' : 'cursos favoritos'}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onUnfavorite={handleUnfavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">
              {searchTerm ? 'Nenhum curso favorito encontrado' : 'Você ainda não tem favoritos'}
            </h2>
            <p className="text-gray-400">
              {searchTerm 
                ? 'Tente ajustar sua busca para encontrar o curso que procura.'
                : 'Explore nossos cursos e adicione seus favoritos para encontrá-los facilmente depois.'}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
