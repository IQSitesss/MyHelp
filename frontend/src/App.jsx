import { useEffect, useState } from 'react';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';

const API_URL = 'https://myhelp.onrender.com/api/tasks';
const PASSWORD = import.meta.env.VITE_PASSWORD;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (authed) fetchTasks();
  }, [authed]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (!authed) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>👋 Привет!</h1>
          <p>Введи пароль чтобы войти</p>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Пароль"
              autoFocus
            />
            <button type="submit">Войти</button>
          </form>
          {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  const dailyTasks = tasks.filter(t => t.type === 'daily');
  const weeklyTasks = tasks.filter(t => t.type === 'weekly');

  const dailyProgress = dailyTasks.length === 0 ? 0 : Math.round(
    (dailyTasks.filter(t => t.completed).length / dailyTasks.length) * 100
  );

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Мои задачи ✨</h1>
        <p>{today}</p>
      </div>

      <TaskForm fetchTasks={fetchTasks} />

      <div className="progress-section">
        <div className="progress-header">
          <p className="section-title">📅 Ежедневные</p>
          <span className="progress-count">
            {dailyTasks.filter(t => t.completed).length} / {dailyTasks.length}
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${dailyProgress}%` }} />
          {dailyProgress === 100 && dailyTasks.length > 0 && (
            <span className="progress-done">🎉</span>
          )}
        </div>
      </div>

      <TaskList tasks={dailyTasks} fetchTasks={fetchTasks} />

      <div className="weekly-section">
        <p className="section-title">📆 Еженедельные</p>
        <TaskList tasks={weeklyTasks} fetchTasks={fetchTasks} />
      </div>
    </div>
  );
}