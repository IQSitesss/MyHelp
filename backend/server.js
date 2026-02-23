import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import tasksRoutes from './routes/tasks.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://myhelp-frontend.onrender.com'
}));

app.use(express.json());

app.use('/api/tasks', tasksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));