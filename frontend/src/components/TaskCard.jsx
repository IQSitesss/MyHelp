const API_URL = 'https://myhelp.onrender.com/api/tasks';

export default function TaskCard({ task, fetchTasks }) {
  const toggleComplete = async () => {
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    fetchTasks();
  };

  const deleteTask = async () => {
    await fetch(`${API_URL}/${task.id}`, {
      method: 'DELETE'
    });
    fetchTasks();
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
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <input type="checkbox" checked={!!task.completed} onChange={toggleComplete} />
      <div className="task-info">
        <strong>{task.title}</strong>
        {task.description && <p>{task.description}</p>}
      </div>
      {!task.completed && <button onClick={editTask}>⚙️</button>}
      <button onClick={deleteTask}>❌</button>
    </div>
  );
}