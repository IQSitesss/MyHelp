import express from 'express';
import { getTasks, addTask, editTask, removeTask } from '../controllers/tasksController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware); // ✅ включено

router.get('/', getTasks);
router.post('/', addTask);
router.put('/:id', editTask);
router.delete('/:id', removeTask);

export default router;
