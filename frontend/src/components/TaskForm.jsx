import { useState } from 'react';

const API_URL = 'https://myhelp.onrender.com/api/tasks';

export default function TaskForm({ fetchTasks, token }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('task');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, type })
    });
    setTitle('');
    fetchTasks();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Новая задача" required />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="task">Задача</option>
        <option value="daily">Ежедн.</option>
        <option value="weekly">Еженед.</option>
      </select>
      <button type="submit">➕</button>
    </form>
  );
}
