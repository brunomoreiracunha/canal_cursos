import React, { useState, useEffect } from 'react';
import { Category } from '../types/categoryType';
import { useToast } from '../contexts/ToastContext';
import { RichTextEditor } from './RichTextEditor';
import { Course, CourseMedia, CourseLearningObjective} from '../types/courseType';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import 'react-quill/dist/quill.snow.css'; 

interface CourseFormProps {
  course?: Course;
  categories: Category[];
  loading: boolean;
  onSubmit: (courseData: Omit<Course, 'id'>) => void;
}

const initialFormData: Omit<Course, 'id'> = {
  title: '',
  category_id: 0,
  image: '',
  price: 0,
  description: '',
  instructor: '',
  duration: '',
  level: '',
  rating: 0,
  link_venda: '',
  featured: 0,
  formatted_description: '',
  course_media: [] as CourseMedia[],
  learning_objectives: [] as CourseLearningObjective[],
};

export function CourseForm({
  course,
  categories,
  loading,
  onSubmit
}: CourseFormProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [newMedia, setNewMedia] = useState<CourseMedia>({
    id: Date.now(),
    course_id: course?.id || 0,
    type: 'image',
    url: '',
    title: ''
  });

  // Carrega dados do curso para edição
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        category_id: course.category_id || 0,
        image: course.image || '',
        price: course.price || 0,
        description: course.description || '',
        instructor: course.instructor || '',
        duration: course.duration || '',
        level: course.level || '',
        rating: course.rating || 0,
        link_venda: course.link_venda || '',
        featured: course.featured || 0,
        formatted_description: course.formatted_description || '',
        course_media: course.course_media || [],
        learning_objectives: normalizeObjectives(course.learning_objectives || []),
      });
    }
  }, [course]);

  // Handler genérico para inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : ['price', 'rating', 'featured', 'category_id'].includes(name)
        ? Number(value)
        : value
    }));
  };

  // Handler específico para o editor de texto rico
  const handleQuillChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      formatted_description: value
    }));
  };

  function normalizeObjectives(objectives: any[]): any[] {
    return Array.isArray(objectives)
      ? objectives.map(obj => ({
          ...obj,
          items: Array.isArray(obj.items)
            ? obj.items.map((item: any) =>
                typeof item === 'string'
                  ? { item } // transforma string em objeto
                  : { ...item }
              )
            : [],
        }))
      : [];
  }

  const handleObjectiveItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objIndex: number,
    itemIndex: number
  ) => {
    setFormData(prevFormData => {
      const updatedObjectives = prevFormData?.learning_objectives?.map((obj, oi) => {
        if (oi !== objIndex) return obj;
        // Copia o array de items e o item específico
        const updatedItems = obj?.items?.map((item, ii) => {
          if (ii !== itemIndex) return item;
          return { ...item, item: e.target.value };
        });
        return { ...obj, items: updatedItems };
      });
      return { ...prevFormData, learning_objectives: updatedObjectives };
    });
  };

  // Handlers para mídias
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMedia(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMedia = () => {
    if (newMedia.url && newMedia.type) {
      setFormData(prev => ({
        ...prev,
        course_media: [...(prev.course_media || []), { ...newMedia, id: Date.now() }]
      }));
      setNewMedia({ id: Date.now(), course_id: course?.id || 0, type: 'image', url: '', title: '' });
    }
  };

  const handleRemoveMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      course_media: prev.course_media?.filter((_, i) => i !== index)
    }));
  };

  // Handlers para objetivos de aprendizagem
  const addLearningObjective = () => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: [
        ...(prev.learning_objectives || []),
        { id: Date.now(), course_id: course?.id || 0, title: '', items: [] }
      ]
    }));
  };

  const updateLearningObjectiveTitle = (id: number, title: string) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: (prev.learning_objectives || []).map(obj =>
        obj.id === id ? { ...obj, title } : obj
      )
    }));
  };

  const removeLearningObjective = (id: number) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: (prev.learning_objectives || []).filter(obj => obj.id !== id)
    }));
  };

  // Handlers para itens de aprendizagem
  const addLearningItem = (objectiveId: number) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: (prev.learning_objectives || []).map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              items: [
                ...obj.items,
                { id: Date.now(), item: '', course_learning_objective_id: objectiveId }
              ]
            }
          : obj
      )
    }));
  };

  const updateLearningItem = (objectiveId: number, itemId: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: (prev.learning_objectives || []).map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              items: obj.items.map(item =>
                item.id === itemId
                  ? { ...item, item: value }
                  : item
              )
            }
          : obj
      )
    }));
  };

  const removeLearningItem = (objectiveId: number, itemId: number) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: (prev.learning_objectives || []).map(obj =>
        obj.id === objectiveId
          ? { ...obj, items: obj.items.filter(item => item.id !== itemId) }
          : obj
      )
    }));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); // Inicia o loading
    try {
      if (course?.id) {
        console.log('Dados do formulário:', formData);
        console.log('Learning objectives:', formData.learning_objectives);
        console.log('Course media:', formData.course_media);
        
        await courseService.updateCourse(Number(course.id), {
          ...formData,
          id: Number(course.id),  
          price: Number(formData.price),
          rating: Number(formData.rating),
          formatted_description: formData.formatted_description,
          course_media: formData.course_media,
          learning_objectives: formData.learning_objectives?.map(obj => ({
            ...obj,
            items: obj.items.map(item => ({
              ...item,
              item: item.item
            }))
          })) || []
        });
        showToast('O Curso foi atualizado com sucesso!', 'success');
        navigate('/curso/' + course.id);
      } else {
        await courseService.addCourse({
          ...formData,
          price: Number(formData.price),
          rating: Number(formData.rating),
          formatted_description: formData.formatted_description,
          course_media: formData.course_media,
          learning_objectives: formData.learning_objectives?.map(obj => ({
            ...obj,
            items: obj.items.map(item => ({
              ...item,
              item: item.item
            }))
          })) || []
        });
        showToast('O Curso foi criado com sucesso!', 'success');
        navigate('/cursos');
      }
    } catch (err) {
      console.error('Erro ao salvar o curso:', err);
      if (err instanceof Error) {
        showToast(err.message || 'Erro ao salvar o curso', 'error');
      } else {
        showToast('Erro ao salvar o curso', 'error');
      }
    } finally {
      setIsSaving(false); // Finaliza o loading
    }
  };

  return (
    <div>
      {isSaving && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 text-white px-8 py-6 rounded-lg flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Salvando alterações...</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Título do Curso</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          {/* Categoria */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium">Categoria</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>
          {/* Instrutor */}
          <div>
            <label htmlFor="instructor" className="block text-sm font-medium">Instrutor</label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          {/* Preço */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium">Preço</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          {/* Duração */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium">Duração</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          {/* Nível */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium">Nível</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              <option value="">Selecione um nível</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>
          {/* Nota */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium">Nota</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          {/* Imagem */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium">Imagem (URL)</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          {/* Link de Venda */}
          <div>
            <label htmlFor="link_venda" className="block text-sm font-medium">Link de Venda</label>
            <input
              type="text"
              id="link_venda"
              name="link_venda"
              value={formData.link_venda}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          {/* Destaque */}
          <div>
            <label htmlFor="featured" className="block text-sm font-medium">Destaque</label>
            <select
              id="featured"
              name="featured"
              value={formData.featured}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value={0}>Não</option>
              <option value={1}>Sim</option>
            </select>
          </div>
        </div>

        {/* Mídias */}
        <div>
          <label className="block text-sm font-medium mb-2">Mídias</label>
          <div className="flex items-center gap-2 mb-2">
            <select name="type" value={newMedia.type} onChange={handleMediaChange} className="p-2 rounded bg-gray-700 text-white">
              <option value="image">🖼️ Imagem</option>
              <option value="video">🎬 Vídeo</option>
            </select>
            <input
              type="text"
              name="url"
              value={newMedia.url}
              onChange={handleMediaChange}
              placeholder="URL"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
            <input
              type="text"
              name="title"
              value={newMedia.title || ''}
              onChange={handleMediaChange}
              placeholder="Título (opcional)"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
            <button
              type="button"
              onClick={handleAddMedia}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Adicionar
            </button>
          </div>
          {(formData?.course_media?.length ?? 0) > 0 && (
            <div className="space-y-2">
              {formData?.course_media?.map((media, idx) => (
                <div key={media.id} className="flex items-center gap-2">
                  <span>{media.type === 'image' ? '🖼️' : '🎬'}</span>
                  <span>{media.url}</span>
                  <span>{media.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(idx)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Objetivos de Aprendizagem */}
        <div>
          <label className="block text-sm font-medium mb-2">Objetivos de Aprendizagem</label>
          {formData?.learning_objectives?.map((obj) => (
            <div key={obj.id} className="mb-4 border border-gray-700 rounded p-4">
              <div className="flex items-center gap-2 mb-2"> 
                <input
                  type="text"
                  value={obj.title}
                  onChange={e => updateLearningObjectiveTitle(obj.id, e.target.value)}
                  placeholder="Título do objetivo"
                  className="w-full mb-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
                <button
                  type="button"
                  onClick={() => removeLearningObjective(obj.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-700"
                >
                  Remover Objetivo
                </button>
              </div>
              {formData?.learning_objectives?.map((obj, objIndex) => (
                <div key={obj.id}>
                  <label className="block text-sm font-medium mb-2">Itens</label>
                  {obj.items.map((item, itemIndex) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.item}
                        onChange={e => handleObjectiveItemChange(e, objIndex, itemIndex)}
                        placeholder="Item"
                        className="flex-1 px-3 mt-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeLearningItem(obj.id, item.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLearningItem(obj.id)}
                    className="my-5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-800"
                  >
                    Adicionar Item
                  </button>
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={addLearningObjective}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Adicionar objetivo de aprendizagem
          </button>
        </div>
        {/* Descrição */}
        <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
          {/* Informações do Curso */}
          <div className="col-span-full">
            <label htmlFor="courseInfo" className="block text-sm font-medium">
              Informações do Curso
            </label>
            <div className="mt-1">
              <RichTextEditor
                value={formData?.formatted_description || ''}
                onChange={handleQuillChange}
              />
            </div>
          </div>
          
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/cursos')}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={loading || isSaving}
          >
            {isSaving ? 'Salvando...' : (course ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
}