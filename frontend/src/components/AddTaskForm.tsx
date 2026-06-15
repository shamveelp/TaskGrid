import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface Props {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd(title);
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-section">
      <form className="add-form" onSubmit={handleSubmit}>
        <input
          className="add-input"
          placeholder="Add a new task and press Enter..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          className={`add-btn${isSubmitting ? ' add-btn--loading' : ''}`}
          type="submit"
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting
            ? <Loader2 size={18} className="spin" />
            : <Plus size={18} />
          }
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}
