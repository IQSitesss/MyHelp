import { db } from '../db.js';

export const getAllTasks = async () => db.all('SELECT * FROM tasks ORDER BY createdAt DESC');
export const getTaskById = async (id) => db.get('SELECT * FROM tasks WHERE id = ?', id);
export const createTask = async ({ title, description, type }) => {
  const now = new Date().toISOString();
  return db.run(
    'INSERT INTO tasks (title, description, type, completed, createdAt, updatedAt) VALUES (?, ?, ?, 0, ?, ?)',
    [title, description || '', type, now, now]
  );
};
export const updateTask = async (id, fields) => {
  const task = await getTaskById(id);
  if (!task) return null;

  const updated = { ...task, ...fields, updatedAt: new Date().toISOString() };
  await db.run(
    'UPDATE tasks SET title=?, description=?, type=?, completed=?, updatedAt=? WHERE id=?',
    [updated.title, updated.description, updated.type, updated.completed ? 1 : 0, updated.updatedAt, id]
  );
  return updated;
};
export const deleteTask = async (id) => db.run('DELETE FROM tasks WHERE id=?', id);
export const resetWeeklyTasks = async () => db.run('UPDATE tasks SET completed=0 WHERE type="weekly"');