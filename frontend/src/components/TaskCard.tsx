import type { Task, TaskStatus } from '../types/task';
import { CheckCircle2, Trash2, RotateCcw, CheckCheck } from 'lucide-react';

interface Props {
  task: Task;
  onMove: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TaskCard({ task, onMove, onDelete }: Props) {
  const isDone = task.status === 'done';

  return (
    <div className="task-card">
      {isDone
        ? <CheckCircle2 className="task-check" size={18} />
        : <span className="task-check-placeholder" />
      }
      <span className="task-title">{task.title}</span>
      <div className="task-actions">
        <button
          className="icon-btn move"
          title={isDone ? 'Move back to In Progress' : 'Mark as done'}
          onClick={() => onMove(task.id, isDone ? 'todo' : 'done')}
        >
          {isDone ? <RotateCcw size={16} /> : <CheckCheck size={16} />}
        </button>
        <button
          className="icon-btn del"
          title="Delete task"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
