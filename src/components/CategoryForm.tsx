import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Category, IconName } from '../types/categoryType';
import { useToast } from "../contexts/ToastContext";

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (category: Category) => void;
}

export function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [iconName, setIconName] = useState<IconName | undefined>("Database");

  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setIconName(category.icon);
    } else {
      setTitle("");
      setIconName("Database");
    }
  }, [category]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !iconName) {
      showToast("Preencha todos os campos!", "error");
      return;
    }
    const categoryData: Category = {
      ...category,
      title,
      name: title.toLowerCase(),
      icon: iconName,
    } as Category;
    onSubmit(categoryData);
    showToast(category ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!", "success");
    setTitle("");
    setIconName("Database");
  }

  const IconComponent = iconName ? (Icons[iconName] as LucideIcon) : Icons.Database;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Campo Ícone + Preview */}
        <div>
            <label className="block text-base text-white mb-1">Ícone:</label>
            <div className="flex items-center gap-3">
            <select
                value={iconName || ''}
                onChange={(e) => setIconName(e.target.value as IconName)}
                className="w-auto px-3 py-2 text-base border border-gray-700 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
                <option value="">Selecione</option>
                {Object.keys(Icons).map((name) => (
                <option key={name} value={name}>{name}</option>
                ))}
            </select>
            <span className="text-gray-400 text-base">Preview:</span>
            <div className="p-2 bg-gray-800 rounded-md">
                <IconComponent size={22} className="text-red-500" />
            </div>
            </div>
        </div>

        {/* Campo Título */}
        <div>
            <label className="block text-base text-white mb-1">Título:</label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título"
            className="w-auto px-3 py-2 text-base border border-gray-700 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
        </div>

        {/* Botão */}
        <button
            type="submit"
            disabled={!title || !iconName}
            className="bg-blue-700 text-white text-base px-5 py-2.5 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {category ? 'Atualizar' : 'Criar'} Categoria
        </button>
    </form>
  );
}