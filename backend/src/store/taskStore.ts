import { Task } from '../types/task';

let tasks: Task[] = [];
let nextId = 1;

export const taskStore = {
  getAll: (): Task[] => tasks,

  getById: (id: number): Task | undefined =>
    tasks.find(t => t.id === id),

  create: (title: string): Task => {
    const task: Task = { id: nextId++, title: title.trim(), status: 'todo' };
    tasks.push(task);
    return task;
  },

  updateStatus: (id: number, status: 'todo' | 'done'): Task | null => {
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    task.status = status;
    return task;
  },

  remove: (id: number): boolean => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
};
