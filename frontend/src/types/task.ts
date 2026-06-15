export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export interface CreateTaskPayload {
  title: string;
}

export interface UpdateTaskPayload {
  status: TaskStatus;
}

export interface ApiError {
  error: string;
}
