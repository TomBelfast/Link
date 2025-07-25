export type TodoStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  status?: TodoStatus;
} 