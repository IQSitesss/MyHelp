import { useState } from 'react';

const API_URL = 'https://myhelp.onrender.com/api/tasks';

export default function TaskCard({ task, fetchTasks, token, pinned, onTogglePin }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const isLong = task.title.length > 28;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const toggleComplete = async () => {
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ completed: !task.completed })
    });
    fetchTasks();
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    } else {
      fetch(`${API_URL}/${task.id}`, { method: 'DELETE', headers }).then(fetchTasks);
    }
  };

  const startEdit = () => {
    setEditValue(task.title);
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!editValue.trim()) return;
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ title: editValue.trim() })
    });
    setEditing(false);
    fetchTasks();
  };

  const cancelEdit = () => {
    setEditValue(task.title);
    setEditing(false);
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${expanded ? 'expanded' : ''} ${pinned ? 'pinned' : ''}`}>
      <div className="task-card-main">
        <input type="checkbox" checked={!!task.completed} onChange={toggleComplete} />

        <div className="task-info">
          {editing ? (
            <div className="edit-inline">
              <input
                className="edit-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                autoFocus
              />
              <div className="edit-actions">
                <button className="edit-save" onClick={saveEdit}>✅</button>
                <button className="edit-cancel" onClick={cancelEdit}>✖</button>
              </div>
            </div>
          ) : (
            <strong className={!expanded && isLong ? 'truncated' : ''}>{task.title}</strong>
          )}
          {task.description && expanded && <p>{task.description}</p>}
        </div>

        {!task.completed && !editing && (
          <button onClick={startEdit} title="Редактировать">⚙️</button>
        )}

        <button
          onClick={() => onTogglePin(task.id)}
          title={pinned ? 'Открепить' : 'Закрепить'}
          style={{ opacity: pinned ? 1 : 0.35, fontSize: 15 }}
        >
          📌
        </button>

        <button
          onClick={handleDeleteClick}
          style={confirmDelete ? { fontSize: '12px', color: '#f87171', fontWeight: 700 } : {}}
        >
          {confirmDelete ? 'Удалить?' : '❌'}
        </button>

        {isLong && !editing && (
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲' : '▼'}
          </button>
        )}
      </div>
    </div>
  );
}
