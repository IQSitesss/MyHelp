import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, fetchTasks }) {
  const daily = tasks.filter(t => t.type === 'daily');
  const weekly = tasks.filter(t => t.type === 'weekly');

  return (
    <div>
      <div className="task-list">
        {daily.map((task) => (
          <TaskCard key={task.id} task={task} fetchTasks={fetchTasks} />
        ))}
      </div>

      {weekly.length > 0 && (
        <div className="weekly-section">
          <h2>📅 Недельные</h2>
          <div className="task-list">
            {weekly.map((task) => (
              <TaskCard key={task.id} task={task} fetchTasks={fetchTasks} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}