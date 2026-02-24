import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import tasksRoutes from './routes/tasks.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'https://myhelp-1.onrender.com',
    'https://myhelp-frontend.onrender.com'
  ]
}));

app.use(express.json());

// Логин — выдаём JWT токен
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }
  const token = jwt.sign({ user: 'owner' }, process.env.SECRET_KEY, { expiresIn: '30d' });
  res.json({ token });
});

app.use('/api/tasks', tasksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
