import axios from 'axios';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

if (!BASE_URL) {
  console.warn('[taskService] VITE_BACKEND_URL is not set. API calls will fail.');
}

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const { data } = await api.get<Task[]>('/tasks');
    return data;
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await api.post<Task>('/tasks', payload);
    return data;
  },

  updateStatus: async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
