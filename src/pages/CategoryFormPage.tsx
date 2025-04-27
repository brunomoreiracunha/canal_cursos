import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useToast } from "../contexts/ToastContext";
import { useIsAdmin } from "../hooks/userIsAdmin";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { categoryService } from '../services/categoryService';
import { Category } from '../types/categoryType';
import { CategoryForm } from '../components/CategoryForm';
import * as Icons from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Skeleton from "react-loading-skeleton";

export function CategoryFormPage() {
  const { showToast } = useToast();
  const isAdmin = useIsAdmin();
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    setLoading(true);
    try {
      const loadedCategory = await categoryService.getCategoryById(Number(id));
      setCategory(loadedCategory);
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      showToast('Erro ao carregar categoria. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (category: Category) => {
    try {
      if (category.id) {
        await categoryService.updateCategory(category.id, category);
      } else {
        await categoryService.createCategory(category);
      }
      
      // Redirecionar para a lista de categorias
      navigate('/categorias');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      showToast('Erro ao salvar categoria. Tente novamente.', 'error');
    }
  };


  if (!isAdmin) {
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
                <h2 className="text-2xl font-bold">Acesso não autorizado</h2>
            </div>
          </div>
          <Footer />
        </div>
      </>
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
                <div className="text-lg mt-4">Carregando a Categoria...</div>
                <div className="loader" />
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
      
      <div className="container mx-auto px-4 pt-32 pb-8">
        {/* Back Button */}
        <Link 
          to="/categorias" 
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 mb-8 group border border-gray-700 hover:border-gray-600 shadow-sm"
        >
          <Icons.ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Voltar para a lista de categorias</span>
        </Link>
        
        <h1 className="text-2xl font-bold mb-8">
          {category ? 'Editar' : 'Adicionar'} Categoria
        </h1>
        <CategoryForm 
          category={category}
          onSubmit={handleCategorySubmit}
        />
      </div>
      
      <Footer />
    </div>
  );
}