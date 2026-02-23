import { useEffect, useState } from 'react';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';

const API_URL = 'https://myhelp.onrender.com/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="app-container">
      <h1>📝 My Tasks</h1>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskList tasks={tasks} fetchTasks={fetchTasks} />
    </div>
  );
}