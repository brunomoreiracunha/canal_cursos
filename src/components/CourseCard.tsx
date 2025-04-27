import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { useAuth } from '../contexts/AuthContext';
import { useIsAdmin } from '../hooks/userIsAdmin';
import { favoriteService } from '../services/favoriteService';
import type { Course } from '../types/courseType';

interface CourseCardProps {
  course: Course;
  onDelete?: (id: number) => void;
  onEdit?: () => void;
  onUnfavorite?: (id: number) => void;
}

export function CourseCard({ course, onDelete, onUnfavorite }: CourseCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Verifica se o curso está favoritado quando o componente monta
  useEffect(() => {
    if (user) {
      const favorite = favoriteService.isFavorite(user.id, course.id);
      setIsFavorite(favorite);
    }
  }, [user, course.id]);

  const handleFavoriteClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const newState = favoriteService.toggleFavorite(user.id, course.id);
    setIsFavorite(newState);
    
    if (!newState && onUnfavorite) {
      onUnfavorite(course.id);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      {/* Imagem e botão de favorito */}
      <div className="relative">
        <Link to={`/curso/${course.id}`}>
          <img
            src={course.image || '/placeholder.jpg'}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        </Link>

        {user && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-white'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Conteúdo do card */}
      <div
        onClick={() => navigate(`/curso/${course.id}`)}
        className="block p-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
      >
        <h3 className="text-xl font-semibold mb-2 text-white">{course.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>
      
        <div  className="flex justify-between items-center">
          <span className="text-green-500 font-bold text-xl">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(course.price)}
          </span>
          {/* Esse Link permanece, pois não está mais dentro de outro Link */}
          <Link
            to={`/curso/${course.id}`}
            onClick={(e) => e.stopPropagation()} // impede o clique do container
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          >
          Ver Detalhes
        </Link>
      </div>

      {user && isAdmin && (
        <div className="flex justify-end gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/curso/${course.id}/editar`)}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors duration-200"
          >
            Editar
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete?.(course.id)}
      />
    </div>
  );
}
