import { Request, Response } from 'express';
import { ITask, TaskStatus } from '../types/task';

export interface ITaskStore {
  getAll(): ITask[];
  getById(id: number): ITask | undefined;
  create(title: string): ITask;
  updateStatus(id: number, status: TaskStatus): ITask | null;
  remove(id: number): boolean;
}

export interface ITaskController {
  getAll(req: Request, res: Response): void;
  create(req: Request, res: Response): void;
  updateStatus(req: Request<{ id: string }>, res: Response): void;
  remove(req: Request<{ id: string }>, res: Response): void;
}
