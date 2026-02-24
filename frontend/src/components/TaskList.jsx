import { useState } from 'react';
import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, fetchTasks, token }) {
  const [pinnedIds, setPinnedIds] = useState([]);

  const handleTogglePin = (id) => {
    setPinnedIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const sortedTasks = [
    ...tasks.filter(t => pinnedIds.includes(t.id)),
    ...tasks.filter(t => !pinnedIds.includes(t.id))
  ];

  return (
    <div className="task-list">
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          fetchTasks={fetchTasks}
          token={token}
          pinned={pinnedIds.includes(task.id)}
          onTogglePin={handleTogglePin}
        />
      ))}
    </div>
  );
}
