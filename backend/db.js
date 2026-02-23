import dotenv from 'dotenv';
dotenv.config();
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: process.env.DATABASE_URL,
  driver: sqlite3.Database
});

// Инициализация таблицы задач
await db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(type IN ('daily', 'weekly')) NOT NULL,
    completed INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);