import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  showSearch?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  liveSearch?: boolean;
}

export function Header({ showSearch, searchTerm, onSearchChange, liveSearch }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed w-full bg-black bg-opacity-90 z-50 h-[88px]">
      <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/src/assets/logo.png"
            alt="Canal Cursos"
            className="h-20 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center space-x-6">
          {showSearch && (
            <SearchBar
              onSearch={onSearchChange}
              initialValue={searchTerm}
              className="hidden md:block min-w-[300px]"
              liveSearch={liveSearch}
            />
          )}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/favoritos"
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Meus Favoritos"
              >
                <Heart className="w-6 h-6" />
              </Link>
              <span className="text-white">{user.name}</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition"
              >
                Sair
              </button>
            </div>
          ) : (
            /*<button
              onClick={() => navigate('/login')}
              className="bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition"
            >
              Entrar
            </button>*/ null
          )}
        </div>
      </nav>
    </header>
  );
}
