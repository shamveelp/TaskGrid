import { Request, Response } from 'express';
import { ITaskStore, ITaskController } from '../interfaces/task.interface';
import { taskStore } from '../store/taskStore';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { logger } from '../utils/logger';

export class TaskController implements ITaskController {
  constructor(private readonly store: ITaskStore) {}

  getAll = (_req: Request, res: Response): void => {
    const tasks = this.store.getAll();
    logger.debug('TaskController', `getAll → returning ${tasks.length} task(s)`);
    res.status(HTTP_STATUS.OK).json(tasks);
  };

  create = (req: Request, res: Response): void => {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      logger.warn('TaskController', 'create → rejected: empty title');
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.TITLE_EMPTY });
      return;
    }

    const task = this.store.create(title);
    logger.info('TaskController', `create → Task #${task.id} "${task.title}" created`);
    res.status(HTTP_STATUS.CREATED).json(task);
  };

  updateStatus = (req: Request<{ id: string }>, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (status !== 'todo' && status !== 'done') {
      logger.warn('TaskController', `updateStatus → rejected: invalid status "${status}"`);
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.INVALID_STATUS });
      return;
    }

    const task = this.store.updateStatus(id, status);
    if (!task) {
      logger.warn('TaskController', `updateStatus → Task #${id} not found`);
      res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.TASK_NOT_FOUND });
      return;
    }

    logger.info('TaskController', `updateStatus → Task #${id} moved to "${status}"`);
    res.status(HTTP_STATUS.OK).json(task);
  };

  remove = (req: Request<{ id: string }>, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const deleted = this.store.remove(id);

    if (!deleted) {
      logger.warn('TaskController', `remove → Task #${id} not found`);
      res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.TASK_NOT_FOUND });
      return;
    }

    logger.info('TaskController', `remove → Task #${id} deleted`);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  };
}

export const taskController = new TaskController(taskStore);
