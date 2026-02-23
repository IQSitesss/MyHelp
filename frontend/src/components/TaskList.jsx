import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, fetchTasks }) {
  const daily = tasks.filter(t => t.type === 'daily');
  const weekly = tasks.filter(t => t.type === 'weekly');

  return (
    <div>
      {daily.length > 0 && (
        <>
          <p className="section-title">Ежедневные</p>
          <div className="task-list">
            {daily.map((task) => (
              <TaskCard key={task.id} task={task} fetchTasks={fetchTasks} />
            ))}
          </div>
        </>
      )}

      {weekly.length > 0 && (
        <div className="weekly-section">
          <p className="section-title">Недельные</p>
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