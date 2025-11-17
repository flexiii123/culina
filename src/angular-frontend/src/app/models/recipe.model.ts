export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  author: string;
  authorId: number;
  authorAvatar: string;
  averageRating: number;
  ratingCount: number;
  createdAt?: string;
}

export interface RecipeDetail extends Recipe {
  ingredients: string[];
  instructions: string[];
  ratings: Rating[];
}

export interface Rating {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
