import express from 'express';
import { getTasks, addTask, editTask, removeTask } from '../controllers/tasksController.js';

const router = express.Router();

// router.use(authMiddleware); // временно отключено

router.get('/', getTasks);
router.post('/', addTask);
router.put('/:id', editTask);
router.delete('/:id', removeTask);

export default router;