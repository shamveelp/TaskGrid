import { useState, useEffect } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  RotateCcw,
  CheckCheck,
} from 'lucide-react';
import './App.css';

type Task = {
  id: number;
  title: string;
  status: 'todo' | 'done';
};

const API_URL = 'http://localhost:3000/tasks';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      setTasks(await res.json());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const task = await res.json();
      setTasks(prev => [...prev, task]);
      setNewTitle('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const moveTask = async (id: number, status: 'todo' | 'done') => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="header">
        <div className="brand">
          <div>
            <h1>TaskGrid</h1>
            <p className="tagline">Stay focused. Ship faster.</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-num" style={{ color: 'var(--amber)' }}>{todoTasks.length}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num" style={{ color: 'var(--green)' }}>{doneTasks.length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </header>

      {/* ── ADD TASK ── */}
      <div className="add-section">
        {error && <div className="error-banner">{error}</div>}
        <form className="add-form" onSubmit={addTask}>
          <input
            className="add-input"
            placeholder="Add a new task and press Enter…"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <button className="add-btn" type="submit" disabled={!newTitle.trim()}>
            <Plus size={18} />
            Add Task
          </button>
        </form>
      </div>

      {/* ── BOARD ── */}
      {loading ? (
        <div className="loading">Loading tasks…</div>
      ) : (
        <div className="board">
          {/* TO DO */}
          <div className="column col-todo">
            <div className="col-head">
              <span className="col-dot" />
              <span className="col-title">In Progress</span>
              <span className="col-badge">{todoTasks.length}</span>
            </div>
            <div className="col-body">
              {todoTasks.length === 0 ? (
                <div className="empty">
                  <Circle size={36} />
                  <span>All clear — add something to start.</span>
                </div>
              ) : todoTasks.map(task => (
                <div className="task-card" key={task.id}>
                  <Circle className="task-check" size={18} />
                  <span className="task-title">{task.title}</span>
                  <div className="task-actions">
                    <button
                      className="icon-btn move"
                      title="Mark done"
                      onClick={() => moveTask(task.id, 'done')}
                    >
                      <CheckCheck size={16} />
                    </button>
                    <button
                      className="icon-btn del"
                      title="Delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DONE */}
          <div className="column col-done">
            <div className="col-head">
              <span className="col-dot" />
              <span className="col-title">Completed</span>
              <span className="col-badge">{doneTasks.length}</span>
            </div>
            <div className="col-body">
              {doneTasks.length === 0 ? (
                <div className="empty">
                  <CheckCircle2 size={36} />
                  <span>Nothing here yet - keep going!</span>
                </div>
              ) : doneTasks.map(task => (
                <div className="task-card" key={task.id}>
                  <CheckCircle2 className="task-check" size={18} />
                  <span className="task-title">{task.title}</span>
                  <div className="task-actions">
                    <button
                      className="icon-btn move"
                      title="Move back"
                      onClick={() => moveTask(task.id, 'todo')}
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      className="icon-btn del"
                      title="Delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
