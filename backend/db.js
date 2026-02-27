import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(type IN ('daily', 'weekly', 'task')) NOT NULL,
    completed INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// Миграция: пересоздаём таблицу с новым CHECK если нужно
await db.execute(`
  CREATE TABLE IF NOT EXISTS tasks_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(type IN ('daily', 'weekly', 'task')) NOT NULL,
    completed INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);
await db.execute(`INSERT OR IGNORE INTO tasks_new SELECT * FROM tasks`);
await db.execute(`DROP TABLE IF EXISTS tasks_old`);
await db.execute(`ALTER TABLE tasks RENAME TO tasks_old`);
await db.execute(`ALTER TABLE tasks_new RENAME TO tasks`);
await db.execute(`DROP TABLE IF EXISTS tasks_old`);
