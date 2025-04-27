import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { useToast } from "../contexts/ToastContext";
import { useIsAdmin } from "../hooks/userIsAdmin";
import { useEffect, useState } from "react";
import { categoryService } from '../services/categoryService';
import * as Icons from "lucide-react";
import { Category } from '../types/categoryType';
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";

export function AllCategoriesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isAdmin = useIsAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Erro ao carregar categorias. Tente novamente mais tarde.');
      showToast('Erro ao carregar categorias. Tente novamente mais tarde.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [showToast]);

  const handleEdit = (categoryId: number) => {
    navigate(`/categorias/${categoryId}/editar`);
  };

  const handleDelete = async (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategoryId) return;

    try {
      await categoryService.deleteCategory(selectedCategoryId);
      showToast('Categoria excluída com sucesso!', 'success');
      // Refresh categories list
      loadCategories();
      setSelectedCategoryId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      showToast('Erro ao excluir categoria. Tente novamente.', 'error');
    }
  };

  const cancelDelete = () => {
    setSelectedCategoryId(null);
    setShowDeleteModal(false);
  };

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
                <div className="text-lg mt-4">Carregando todas as Categorias...</div>
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
                <h2 className="text-2xl font-bold">Erro ao Carregar as Categorias...</h2>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 mb-8 group border border-gray-700 hover:border-gray-600 shadow-sm"
        >
          <Icons.ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Voltar para a página inicial</span>
        </Link>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-8">Categorias</h1>
          <Link
            to="/categorias/novo"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Adicionar Categoria
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category) => {
            const CategoryIcon = (Icons[category.icon as keyof typeof Icons] || Icons.BookOpen) as LucideIcon;
            return (
              <div
                key={category.id}
                className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 relative"
              >
                {/* Link só no conteúdo principal */}
                <Link
                  to={`/categorias/${category.id}/editar`}
                  className="block"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <CategoryIcon size={48} className="text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-gray-400 text-sm">{category.name}</p>
                  </div>
                </Link>

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="p-1 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                      title="Editar"
                    >
                      <Icons.Edit2 size={20} className="text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                      title="Excluir"
                    >
                      <Icons.Trash2 size={20} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        />
      </div>
      <Footer />
    </div>
  );
}
