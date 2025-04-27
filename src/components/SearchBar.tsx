import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (term: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  initialValue?: string;
  /**
   * Se true, a busca é feita em tempo real.
   * Se false, a busca só é feita ao pressionar Enter.
   */
  liveSearch?: boolean;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Buscar cursos...",
  className = "",
  autoFocus = false,
  initialValue = "",
  liveSearch = false
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue || '');
  const navigate = useNavigate();
  const location = useLocation();

  // Atualiza o termo de busca quando o initialValue mudar
  useEffect(() => {
    setSearchTerm(initialValue || '');
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Se estiver na página inicial, redireciona para a página de cursos
    if (location.pathname === '/') {
      navigate(`/cursos?search=${encodeURIComponent(searchTerm)}`);
    } else if (onSearch) {
      // Em outras páginas, chama o onSearch diretamente
      onSearch(searchTerm);
    }
  };

  const handleChange = (value: string) => {
    setSearchTerm(value);
    
    // Se estiver em modo de busca em tempo real e não estiver na página inicial
    if (liveSearch && location.pathname !== '/' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex-1 max-w-xl ${className}`}
    >
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-gray-800 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-400"
        />
        <Search 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </form>
  );
}
