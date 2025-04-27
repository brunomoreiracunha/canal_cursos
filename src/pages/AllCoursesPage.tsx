import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useIsAdmin } from '../hooks/userIsAdmin';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CourseCard } from '../components/CourseCard';
import { courseService } from '../services/courseService';
import { showToast } from '../utils/toast';
import { Course } from '../types/courseType';
import { ArrowLeft } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import Skeleton from 'react-loading-skeleton';

export function AllCoursesPage() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  // Se não houver usuário logado ou não for admin, não mostra os botões de admin
  const showAdminButtons = user && isAdmin;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await courseService.getAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Erro ao carregar os cursos:', error);
        showToast('Erro ao carregar os cursos', 'error');
      }
    };
    fetchCourses();
  }, []);

  // Atualiza a URL quando o termo de busca muda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      setSearchParams({ search: term });
    } else {
      setSearchParams({});
    }
  };

  // Atualiza os cursos filtrados quando o termo de busca muda
  useEffect(() => {
    const fetchFilteredCourses = async () => {
      setLoading(true);
      const filtered = searchTerm
        ? await courseService.searchCourses(searchTerm)
        : await courseService.getAllCourses(); 
      setCourses(filtered);
      setLoading(false);
    };
    fetchFilteredCourses();
  }, [searchTerm]);

  // Atualiza o termo de busca quando a URL muda
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== searchTerm) {
      setSearchTerm(query || '');
    }
  }, [searchParams]);

  const handleEditCourse = (course: Course) => {
    navigate(`/curso/${course.id}/editar`);
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (window.confirm('Deseja realmente excluir este curso?')) {
      try {
        await courseService.removeCourse(courseId);
        setCourses(prev => prev.filter(c => c.id !== courseId));
        showToast('Curso excluído com sucesso!', 'success');
      } catch (error) {
        showToast('Erro ao excluir o curso. Tente novamente.', 'error');
      }
    }
  };

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
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Todos os Cursos</h1>
            <p className="text-gray-400">
              {courses.length} {courses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
            </p>
            <SearchBar 
              onSearch={handleSearch}
              initialValue={searchTerm}
              liveSearch
              className='mt-4'
            />
          </div>
          {showAdminButtons && (
            <Link
              to="/curso/novo"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Adicionar Curso
            </Link>
          )}
        </div>

        {/* Aqui só a área dos resultados mostra o loading */}
        {loading ? (
          <div className="flex flex-col items-center mt-8">
            <Skeleton height={40} width={320} style={{ marginBottom: 24 }} />
            <Skeleton height={24} width={220} style={{ marginBottom: 16 }} />
            <Skeleton count={3} height={18} style={{ marginBottom: 8 }} />
            <div style={{ marginTop: 32 }}>
              <Skeleton height={200} />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg mt-4">Carregando os Cursos...</div>
              <div className="loader" />
            </div>
          </div>
        ) : (
          <>
            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={() => handleEditCourse(course)}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>

            {/* Empty State */}
            {courses.length === 0 && (
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
