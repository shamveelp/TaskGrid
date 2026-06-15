import { Router } from 'express';
import { taskController } from '../controllers/taskController';

const router = Router();

router.get('/', taskController.getAll);
router.post('/', taskController.create);
router.put('/:id', taskController.updateStatus);
router.delete('/:id', taskController.remove);

export default router;
