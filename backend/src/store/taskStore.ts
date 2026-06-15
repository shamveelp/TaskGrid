import { ITask, TaskStatus } from '../types/task';
import { ITaskStore } from '../interfaces/task.interface';

export class TaskStore implements ITaskStore {
  private tasks: ITask[] = [];
  private nextId = 1;

  getAll(): ITask[] {
    return this.tasks;
  }

  getById(id: number): ITask | undefined {
    return this.tasks.find(t => t.id === id);
  }

  create(title: string): ITask {
    const task: ITask = {
      id: this.nextId++,
      title: title.trim(),
      status: 'todo',
    };
    this.tasks.push(task);
    return task;
  }

  updateStatus(id: number, status: TaskStatus): ITask | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    task.status = status;
    return task;
  }

  remove(id: number): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}

export const taskStore = new TaskStore();
