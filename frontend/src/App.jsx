import { useEffect, useState, useRef } from 'react';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import BusWidget from './components/BusWidget.jsx';

const API_URL = 'https://myhelp.onrender.com/api/tasks';
const PASSWORD = import.meta.env.VITE_PASSWORD;

// ---- Конфетти ----
function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 8 + 4,
      color: ['#a5b4fc','#f9a8d4','#6ee7b7','#fcd34d','#f87171'][Math.floor(Math.random()*5)],
      speed: Math.random() * 3 + 2,
      swing: Math.random() * 2 - 1,
      angle: Math.random() * 360,
      spin: Math.random() * 4 - 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.5);
        ctx.restore();
        p.y += p.speed;
        p.x += p.swing;
        p.angle += p.spin;
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    const timeout = setTimeout(() => {
      cancelAnimationFrame(animRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 3000);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(timeout);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 999
      }}
    />
  );
}

// ---- Streak ----
function getStreak() {
  try {
    const data = JSON.parse(localStorage.getItem('streak') || '{}');
    return data;
  } catch { return {}; }
}

function updateStreak(allCompleted) {
  const today = new Date().toDateString();
  const data = getStreak();

  if (!allCompleted) return data;
  if (data.lastDate === today) return data;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isConsecutive = data.lastDate === yesterday.toDateString();

  const newData = {
    lastDate: today,
    count: isConsecutive ? (data.count || 0) + 1 : 1
  };
  localStorage.setItem('streak', JSON.stringify(newData));
  return newData;
}

function StreakBadge({ count }) {
  if (!count || count < 1) return null;
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: 'linear-gradient(135deg, #fcd34d, #f97316)',
      borderRadius: 12,
      padding: '4px 12px',
      fontSize: 13,
      fontWeight: 800,
      color: 'white',
      boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
      marginLeft: 8
    }}>
      🔥 {count} {count === 1 ? 'день' : count < 5 ? 'дня' : 'дней'}
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(getStreak());
  const prevCompleted = useRef(false);

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (authed) fetchTasks();
  }, [authed]);

  // Следим за выполнением всех дневных задач
  useEffect(() => {
    const daily = tasks.filter(t => t.type === 'daily');
    if (daily.length === 0) return;
    const allDone = daily.every(t => t.completed);

    if (allDone && !prevCompleted.current) {
      setShowConfetti(true);
      const newStreak = updateStreak(true);
      setStreak(newStreak);
      setTimeout(() => setShowConfetti(false), 3500);
    }
    prevCompleted.current = allDone;
  }, [tasks]);

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
      <Confetti active={showConfetti} />

      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <h1 style={{ margin: 0 }}>Мои задачи ✨</h1>
          <StreakBadge count={streak.count} />
        </div>
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

      <BusWidget />
    </div>
  );
}
