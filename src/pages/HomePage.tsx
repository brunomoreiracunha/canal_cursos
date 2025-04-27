import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useIsAdmin } from '../hooks/userIsAdmin';
import { ChevronRight } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { CourseCard } from '../components/CourseCard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { courseService } from '../services/courseService';
import { categoryService } from '../services/categoryService';
import { showToast } from '../utils/toast';
import { Course } from '../types/courseType';
import { Category } from '../types/categoryType';
import { SearchBar } from '../components/SearchBar';

export function HomePage() {
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    courseService.getAllCoursesByFeatured()
      .then(courses => setCourses(courses))
      .catch(error => {
        console.error('Erro ao carregar cursos:', error);
        showToast('Erro ao carregar cursos', 'error');
      });
    categoryService.getAllCategories()
      .then(categories => setCategories(categories))
      .catch(error => {
        console.error('Erro ao carregar categorias:', error);
        showToast('Erro ao carregar categorias', 'error');
      });
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await courseService.removeCourse(id);
      courseService.getAllCourses()
        .then(courses => setCourses(courses))
        .catch(error => {
          console.error('Erro ao excluir curso:', error);
          showToast('Erro ao excluir o curso. Tente novamente.', 'error');
        });
      showToast('Curso excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      showToast('Erro ao excluir o curso. Tente novamente.', 'error');
    }
  };

  const handleExploreCourses = () => {
    navigate('/cursos');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header/>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4">Aprenda com os Melhores</h2>
            <p className="text-xl text-gray-300 mb-8">
              Cursos online de alta qualidade para impulsionar sua carreira e conhecimento.
            </p>
            <button 
              className="bg-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition flex items-center"
              onClick={handleExploreCourses}
            >
              Todos os Cursos
              <ChevronRight className="ml-2" />
            </button>
            <SearchBar className='mt-4'/>
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold mb-6">Categorias</h3>
            <div className="flex space-x-2">
              {isAdmin && (
                <Link
                to="/categorias"
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
              >
                Explorar Categorias
              </Link>
              )}
              {isAdmin && (
                <Link
                  to="/categorias/novo"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Adicionar Categoria
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Cursos em Destaque</h1>
            {isAdmin && (
              <Link
                to="/curso/novo"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Adicionar Curso
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
