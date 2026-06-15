export type TaskStatus = 'todo' | 'done';

export interface ITask {
  id: number;
  title: string;
  status: TaskStatus;
}
