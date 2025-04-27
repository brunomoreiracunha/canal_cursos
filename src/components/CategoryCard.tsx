import { useNavigate } from 'react-router-dom';
import { Category, IconName } from '../types/categoryType';
import * as Icons from 'lucide-react';

interface CategoryCardProps extends Category {
  id: number;
  icon: IconName;
  title: string;
  name: string;
}

export function CategoryCard({ icon, title, id }: CategoryCardProps) {
  const navigate = useNavigate();
  const IconComponent = (Icons[icon] || Icons.BookOpen) as React.ComponentType<{ size?: number }>;

  const handleClick = () => {
    navigate(`/categoria/${id}`);
  };

  return (
    <div 
      className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="text-red-600 mb-3">
        <IconComponent size={24} />
      </div>
      <h4 className="font-semibold text-white">{title}</h4>
    </div>
  );
}
