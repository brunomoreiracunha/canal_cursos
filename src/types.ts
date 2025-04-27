export interface Course {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  thumbnailUrl: string;
  heroImageUrl?: string;
  logoUrl?: string;
  previewUrl: string;
  videoUrl?: string;
  duration: string;
  level: string;
  matchPercentage: number;
  tags: string[];
  releaseYear: number;
  rating: number;
  episodes?: CourseEpisode[];
}

export interface CourseEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
}