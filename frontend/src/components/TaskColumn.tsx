import type { ReactNode } from 'react';
import type { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';

interface Props {
  title: string;
  tasks: Task[];
  columnClass: string;
  emptyIcon: ReactNode;
  emptyText: string;
  onMove: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TaskColumn({
  title,
  tasks,
  columnClass,
  emptyIcon,
  emptyText,
  onMove,
  onDelete,
}: Props) {
  return (
    <div className={`column ${columnClass}`}>
      <div className="col-head">
        <span className="col-dot" />
        <span className="col-title">{title}</span>
        <span className="col-badge">{tasks.length}</span>
      </div>
      <div className="col-body">
        {tasks.length === 0 ? (
          <div className="empty">
            {emptyIcon}
            <span>{emptyText}</span>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
