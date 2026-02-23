import { useState } from 'react';

const API_URL = 'https://myhelp.onrender.com/api/tasks';

export default function TaskForm({ fetchTasks }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('daily');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, type })
    });
    setTitle('');
    fetchTasks();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" required />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <button type="submit">➕ Add</button>
    </form>
  );
}