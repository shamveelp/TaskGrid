import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd(title);
    setTitle('');
  };

  return (
    <div className="add-section">
      <form className="add-form" onSubmit={handleSubmit}>
        <input
          className="add-input"
          placeholder="Add a new task and press Enter..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button className="add-btn" type="submit" disabled={!title.trim()}>
          <Plus size={18} />
          Add Task
        </button>
      </form>
    </div>
  );
}
