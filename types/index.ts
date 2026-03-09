export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  shareable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface DisplayCategory {
  id: string;
  name: string;
  count: number;
  _id?: string;
}
export interface AuthResponse {
  message?: string;
  error?: string;
  isSetup?: boolean;
}
