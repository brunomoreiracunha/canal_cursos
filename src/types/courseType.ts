import { Category } from "./categoryType";

export interface CourseMedia {
  id: number;
  course_id: number;
  type: 'image' | 'video';
  url: string;
  title?: string;
}

export interface Course {
  id: number;
  title: string;
  category_id: number;
  category?: Category;
  image: string; // Thumbnail do produto
  price: number;
  description?: string;
  instructor?: string;
  duration: string;
  level?: string;
  rating: number;
  link_venda: string; // Link para compra do produto
  featured?: number; // Indica se o curso está em destaque
  formatted_description?: string; // Adicionando campo para descrição com formatação Descrição com formatação (HTML)
  course_media?: CourseMedia[]; // Mídia do curso
  learning_objectives?: CourseLearningObjective[]; // Objetivos do curso
}

export interface CourseLearningObjective {
  id: number;
  course_id: number;
  title: string;
  items: CourseLearningItems[];
}

export interface CourseLearningItems {
  id: number;
  course_learning_objective_id: number;
  item: string;
}