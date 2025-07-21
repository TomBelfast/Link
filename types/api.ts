// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form data types
export interface LinkFormData {
  url: string;
  title: string;
  description?: string;
}

export interface IdeaFormData {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
}

// API Error types
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, any>;
}