import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, fetchTasks }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}     // ← ВОТ ЭТА СТРОКА ЧИНИТ ВСЁ
          task={task}
          fetchTasks={fetchTasks}
        />
      ))}
    </div>
  );
}