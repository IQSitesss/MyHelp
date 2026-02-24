import { db } from '../db.js';

export const getAllTasks = async () => {
  const result = await db.execute('SELECT * FROM tasks ORDER BY createdAt DESC');
  return result.rows;
};

export const getTaskById = async (id) => {
  const result = await db.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [id] });
  return result.rows[0] || null;
};

export const createTask = async ({ title, description, type }) => {
  const now = new Date().toISOString();
  const result = await db.execute({
    sql: 'INSERT INTO tasks (title, description, type, completed, createdAt, updatedAt) VALUES (?, ?, ?, 0, ?, ?)',
    args: [title, description || '', type, now, now],
  });
  return { lastID: Number(result.lastInsertRowid) };
};

export const updateTask = async (id, fields) => {
  const task = await getTaskById(id);
  if (!task) return null;

  const updated = { ...task, ...fields, updatedAt: new Date().toISOString() };
  await db.execute({
    sql: 'UPDATE tasks SET title=?, description=?, type=?, completed=?, updatedAt=? WHERE id=?',
    args: [updated.title, updated.description, updated.type, updated.completed ? 1 : 0, updated.updatedAt, id],
  });
  return updated;
};

export const deleteTask = async (id) => {
  await db.execute({ sql: 'DELETE FROM tasks WHERE id=?', args: [id] });
};

export const resetWeeklyTasks = async () => {
  await db.execute('UPDATE tasks SET completed=0 WHERE type="weekly"');
};