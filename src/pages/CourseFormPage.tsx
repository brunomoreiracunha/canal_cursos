import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { categoryService } from '../services/categoryService';
import type { Course } from '../types/courseType';
import type { Category } from '../types/categoryType';
import { useToast } from '../contexts/ToastContext';
import { useIsAdmin } from '../hooks/userIsAdmin';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CourseForm } from '../components/CourseForm';
import * as Icons from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { ArrowLeft } from 'lucide-react';

export function CourseFormPage() {
  const { id } = useParams<{ id?: string }>();
  const [course, setCourse] = useState<Course | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { showToast } = useToast();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  // Carregar categorias
  useEffect(() => {
    categoryService.getAllCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Carregar dados do curso se for edição
  useEffect(() => {
    setLoading(true);
    const promises = [categoryService.getAllCategories().then(setCategories).catch(() => setCategories([]))];
    if (id) {
      promises.push(
        courseService.getCourseById(Number(id))
          .then(setCourse)
          .catch(err => setError(err.message))
      );
    }
    Promise.all(promises).finally(() => setLoading(false));
  }, [id]);

  // Handler de submit (criação ou edição)
  async function handleSubmit(formData: Omit<Course, 'id'>) {
    (async () => {
      setError(null);
      try {
        if (id) {
          await courseService.updateCourse(Number(id), {
            ...formData,
            category_id: Number(formData.category_id),
          });
          showToast('Curso atualizado com sucesso!', 'success');
        } else {
          await courseService.addCourse({
            ...formData,
            category_id: Number(formData.category_id),
          });
          showToast('Curso criado com sucesso!', 'success');
        }
        navigate('/cursos');
      } catch (err) {
        setError('Erro ao salvar o curso');
      }
    })();
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Header />
        <div className="text-2xl mt-32">Acesso restrito a administradores.</div>
        <Footer />
      </div>
    );
  }

  if (loading) {
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
              <div className="text-lg mt-4">Carregando detalhes do curso...</div>
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
        <div className="min-h-screen bg-black text-white">
          <Header />

          <div className="container mx-auto px-4 pt-24">
            {/* Back Button */}
            <div className="flex justify-between items-center mb-8 mt-4">
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 group border border-gray-700 hover:border-gray-600 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Voltar para a tela inicial</span>
              </Link>
            </div>
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold">Erro: {error}</h2>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-8">
        {/* Back Button */}
        <Link 
          to="/cursos" 
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 mb-8 group border border-gray-700 hover:border-gray-600 shadow-sm"
        >
          <Icons.ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Voltar para a lista de cursos</span>
        </Link>
        <h1 className="text-2xl font-bold mb-8">
          {id ? 'Editar Curso' : 'Novo Curso'}
        </h1>
        <CourseForm
          course={course ?? undefined}
          categories={categories}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
      <Footer />
    </div>
  );
}