import { useState } from 'react';

const API_URL = 'https://myhelp.onrender.com/api/tasks';

export default function TaskCard({ task, fetchTasks }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isLong = task.title.length > 28;

  const toggleComplete = async () => {
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    fetchTasks();
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    } else {
      fetch(`${API_URL}/${task.id}`, { method: 'DELETE' }).then(fetchTasks);
    }
  };

  const editTask = async () => {
    const newTitle = prompt('Изменить задачу:', task.title);
    if (newTitle === null || newTitle.trim() === '') return;
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() })
    });
    fetchTasks();
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${expanded ? 'expanded' : ''}`}>
      <div className="task-card-main">
        <input type="checkbox" checked={!!task.completed} onChange={toggleComplete} />
        <div className="task-info">
          <strong className={!expanded && isLong ? 'truncated' : ''}>
            {task.title}
          </strong>
          {task.description && expanded && <p>{task.description}</p>}
        </div>
        {!task.completed && <button onClick={editTask}>⚙️</button>}
        <button
          onClick={handleDeleteClick}
          style={confirmDelete ? { fontSize: '12px', color: '#f87171', fontWeight: 700 } : {}}
        >
          {confirmDelete ? 'Удалить?' : '❌'}
        </button>
        {isLong && (
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲' : '▼'}
          </button>
        )}
      </div>
    </div>
  );
}