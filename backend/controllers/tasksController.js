import * as Task from '../models/task.js';

export const getTasks = async (req, res) => {
  const tasks = await Task.getAllTasks();
  res.json(tasks);
};

export const addTask = async (req, res) => {
  const { title, description, type } = req.body;
  if (!title || !type) return res.status(400).json({ error: 'Title and type required' });

  const result = await Task.createTask({ title, description, type });
  res.json({ id: result.lastID, title, description, type, completed: false });
};

export const editTask = async (req, res) => {
  const { id } = req.params;
  const updated = await Task.updateTask(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
};

export const removeTask = async (req, res) => {
  const { id } = req.params;
  await Task.deleteTask(id);
  res.json({ success: true });
};