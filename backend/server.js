import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import tasksRoutes from './routes/tasks.js';
import { db } from './db.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://myhelp-1.onrender.com'
}));

app.use(express.json());

// Routes
app.use('/api/tasks', tasksRoutes);

// Reset weekly tasks every Monday
import cron from 'node-cron';
cron.schedule('0 0 * * 1', async () => {
  await db.run('UPDATE tasks SET completed=0 WHERE type="weekly"');
  console.log('Weekly tasks reset');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));