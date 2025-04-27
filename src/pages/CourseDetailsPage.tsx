import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from 'swiper';
import { useIsAdmin } from '../hooks/userIsAdmin';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { courseService } from '../services/courseService';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { StarRating } from '../components/StarRating';
import Skeleton from 'react-loading-skeleton';
import '../styles/course-info.css';
import { Course } from '../types/courseType';


export function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();

  // Se não houver usuário logado ou não for admin, não mostra os botões de admin
  const showAdminButtons = user && isAdmin;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const data = await courseService.getCourseById(id!);
      setCourse(data);
      setLoading(false);
    };
    loadCourse();
  }, [id]);

  const handleDelete = async () => {
    if (!course) return;

    try {
      await courseService.removeCourse(Number(course.id));
      navigate('/cursos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Curso excluído com sucesso!', 'success');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting course:', error);
      showToast('Erro ao excluir o curso. Tente novamente.', 'error');
    }
  };

  /*const getEmbeddedVideoUrl = (url: string): string => {
    const youtubeMatch = url.match(/(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
  
    return url; // fallback caso seja outro tipo de vídeo
  }*/


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

  if (!course) {
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
                <h2 className="text-2xl font-bold">O Curso não foi encontrado...</h2>
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
          {showAdminButtons && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                to={`/curso/${id}/editar`}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
              >
                Editar
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Excluir
              </button>
            </div>
          )}
        </div>

        {/* Course Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Images */}
          <div className="space-y-8">
            {/* Principal Image and Media Gallery */}
            <div className="carousel-container relative">
              <Swiper
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Atualiza o estado conforme o slide muda
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                loop={true} // Enable looping through media
                spaceBetween={10} // Space between slides
                slidesPerView={1} // One slide at a time
                style={{ width: '100%', height: 'auto' }} // Garantir que o swiper tenha largura 100% e altura ajustável
              >
                {/* Imagem Principal */}
                <SwiperSlide style={{ height: '500px' }}>  
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                </SwiperSlide>

                {/* Outras Mídias */}
                {course.course_media?.map((media, index) => (
                  <SwiperSlide key={index} style={{ height: '500px' }}>
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={media.title || `Mídia ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full overflow-hidden relative">
                        <iframe
                          src={media.url}  
                          title={media.title || `Vídeo ${index + 1}`}
                          className="absolute top-0 left-0 w-full h-full"  
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            border: 'none', 
                            display: 'block' 
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Botões de Navegação */}
              {course?.course_media && course.course_media.length > 0 && (
                <div className="absolute top-1/2 left-0 z-30 transform -translate-y-1/2 w-full flex justify-between px-4">
                  <button
                    className="swiper-button-prev"
                    onClick={() => swiperRef.current?.slidePrev()}
                    style={{ zIndex: 30 }} 
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="swiper-button-next"
                  onClick={() => swiperRef.current?.slideNext()}
                  style={{ zIndex: 30 }} 
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              )}
            </div>
          </div>

          {/* Right Column - Course Info */}
          <div className="space-y-8">
            <div>
              <span className="text-red-600 font-semibold mb-2 block">
                {course.category?.title || course.category?.name || 'Sem categoria'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
              <div className="mb-4">
                <StarRating rating={!isNaN(Number(course.rating)) ? Number(course.rating) : 0} size={20} />
              </div>
              <div className="flex flex-wrap gap-4 text-gray-300 mb-6">
                <span className="flex items-center">
                  <User className="mr-2" size={20} />
                  {course.instructor}
                </span>
                <span className="flex items-center">
                  <Clock className="mr-2" size={20} />
                  {course.duration}
                </span>
                <span className="flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  {course.level}
                </span>
              </div>
              <p className="text-gray-300 mb-6">{course.description}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl sm:text-3xl font-bold">R$ {!isNaN(Number(course.price)) ? Number(course.price).toFixed(2) : 'Preço inválido'}</span>
                <a
                  href={course.link_venda}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition inline-block text-center"
                >
                  Comprar Agora
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        {course?.learning_objectives && course.learning_objectives.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 sm:p-8 mt-8">
            {course.learning_objectives.map((objective, objIdx) => (
              <div key={objective.id || objIdx} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{objective.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-gray-300">
                  {objective.items.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{typeof item === 'string' ? item : item.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Info */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Informações do Curso</h3>
          {course?.formatted_description ? (
            <div className="course-info bg-gray-800 p-6 sm:p-8 rounded-lg">
              {/* Desescapando as barras invertidas antes de passar para dangerouslySetInnerHTML */}
              <div 
                dangerouslySetInnerHTML={{ __html: course?.formatted_description || '' }}
                className="text-white"
                style={{
                  listStylePosition: 'inside',
                  marginLeft: 0,
                  paddingLeft: '1.5rem',
                }}
              />
            </div>
          ) : (
            <p className="text-gray-400">Nenhuma informação disponível.</p>
          )}
        </div>



      </div>

      <Footer />

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir o curso "{course.title}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
