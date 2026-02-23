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
        <h1>🔒 Вход</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите пароль"
          />
          <button type="submit">Войти</button>
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>📝 My Tasks</h1>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskList tasks={tasks} fetchTasks={fetchTasks} />
    </div>
  );
}