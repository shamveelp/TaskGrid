import { Request, Response } from 'express';
import { taskStore } from '../store/taskStore';

export const taskController = {
  getAll: (_req: Request, res: Response): void => {
    res.json(taskStore.getAll());
  },

  create: (req: Request, res: Response): any => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title must not be empty' });
    }
    const task = taskStore.create(title);
    res.status(201).json(task);
  },

  updateStatus: (req: Request<{ id: string }>, res: Response): any => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (status !== 'todo' && status !== 'done') {
      return res.status(400).json({ error: 'Status must be "todo" or "done"' });
    }

    const task = taskStore.updateStatus(id, status);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  },

  remove: (req: Request<{ id: string }>, res: Response): any => {
    const id = parseInt(req.params.id, 10);
    const deleted = taskStore.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  },
};
