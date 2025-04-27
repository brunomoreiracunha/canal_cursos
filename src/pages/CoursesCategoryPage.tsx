import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CourseCard } from '../components/CourseCard';
import { courseService } from '../services/courseService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types/categoryType';
import { Course } from '../types/courseType';
import { SearchBar } from '../components/SearchBar';
import Skeleton from 'react-loading-skeleton';

export function CourseCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar a categoria pelo ID
  useEffect(() => {
    if (!categoryId) {
      setCategory(null);
      return;
    }
    setLoading(true);
    setError(null);

    categoryService.getCategoryById(Number(categoryId))
      .then((categoryData) => {
        setCategory(categoryData);
      })
      .catch((err) => {
        setError('Erro ao buscar categoria: ' + err.message);
        setCategory(null);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  // Buscar os cursos da categoria
  useEffect(() => {
    if (!categoryId) {
      setCourses([]);
      return;
    }
    setLoading(true);
    setError(null);

    courseService.getAllCoursesByCategoryId(Number(categoryId))
      .then((coursesData) => {
        setCourses(coursesData);
      })
      .catch((err) => {
        setError('Erro ao buscar cursos: ' + err.message);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCourses(
        courses.filter(course =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCourses(courses);
    }
  }, [courses, searchTerm]);

  const categoryName = category?.name
    ? category.name.charAt(0).toUpperCase() + category.name.slice(1)
    : 'Categoria não encontrada';

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-black text-white px-4 py-8 flex flex-col items-center justify-center">
          <div className="container mx-auto max-w-2xl">
            <Skeleton height={40} width={320} style={{ marginBottom: 24 }} />
            <Skeleton height={24} width={220} style={{ marginBottom: 16 }} />
            <Skeleton count={3} height={18} style={{ marginBottom: 8 }} />
            <div style={{ marginTop: 32 }}>
              <Skeleton height={200} />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg mt-4">Carregando os cursos...</div>
              <div className="loader" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-black text-white px-4 py-8 flex flex-col items-center justify-center">
          <div className="container mx-auto max-w-2xl">
            <div className="flex flex-col items-center">
              <div className="text-lg mt-4">Erro: {error}</div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container mx-auto px-4 pt-32">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 mb-8 group border border-gray-700 hover:border-gray-600 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Voltar para a página inicial</span>
        </Link>

        {/* Category Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Cursos de {categoryName}</h1>
            <p className="text-gray-400">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
            </p>
            <SearchBar 
              onSearch={setSearchTerm}
              liveSearch
              className='mt-4'
            />
          </div>
        </div>

        {isLoading ? (
          <main className="min-h-screen bg-black text-white px-4 py-8 flex flex-col items-center justify-center">
          <div className="container mx-auto max-w-2xl">
            <Skeleton height={40} width={320} style={{ marginBottom: 24 }} />
            <Skeleton height={24} width={220} style={{ marginBottom: 16 }} />
            <Skeleton count={3} height={18} style={{ marginBottom: 8 }} />
            <div style={{ marginTop: 32 }}>
              <Skeleton height={200} />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg mt-4">Carregando os cursos...</div>
              <div className="loader" />
            </div>
          </div>
        </main>
        ) : (
          <>
            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {/* Empty State */}
            {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Nenhum curso encontrado</h2>
              <p className="text-gray-400">
                Tente ajustar sua busca ou volte para a página inicial para ver todos os cursos.
              </p>
            </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
