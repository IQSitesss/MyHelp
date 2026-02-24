import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, fetchTasks, token }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          fetchTasks={fetchTasks}
          token={token}
        />
      ))}
    </div>
  );
}
