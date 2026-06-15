import { useState, useCallback, useEffect } from 'react';
import type { Task, TaskStatus } from '../types/task';
import { taskService } from '../services/taskService';
import axios from 'axios';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (title: string) => Promise<void>;
  moveTask: (id: number, status: TaskStatus) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

const extractErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { error?: string })?.error ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
};

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (title: string): Promise<void> => {
    try {
      const task = await taskService.create({ title });
      setTasks(prev => [...prev, task]);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const moveTask = async (id: number, status: TaskStatus): Promise<void> => {
    try {
      const updated = await taskService.updateStatus(id, { status });
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      await taskService.remove(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return { tasks, loading, error, addTask, moveTask, deleteTask };
}
