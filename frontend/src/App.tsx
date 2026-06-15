import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, ArrowRight, RotateCcw, ListTodo, ClipboardCheck } from 'lucide-react';
import './App.css';

type Task = {
  id: number;
  title: string;
  status: 'todo' | 'done';
};

const API_URL = 'http://localhost:3000/tasks';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (!response.ok) throw new Error('Failed to add task');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
    }
  };

  const handleMoveTask = async (id: number, newStatus: 'todo' | 'done') => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="app-container">
      <header>
        <h1>TaskGrid</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <form className="add-task-container" onSubmit={handleAddTask}>
        <input
          type="text"
          className="add-task-input"
          placeholder="What's next on your mind?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit" className="add-btn" disabled={!newTaskTitle.trim()}>
          <Plus size={20} />
          <span>Add</span>
        </button>
      </form>

      {loading ? (
        <div className="loading">Syncing Tasks...</div>
      ) : (
        <div className="kanban-board">
          {/* To Do Column */}
          <div className="column column-todo">
            <div className="column-header">
              <div className="column-icon">
                <ListTodo size={24} />
              </div>
              <span className="column-title">In Progress</span>
              <span className="task-count">{todoTasks.length}</span>
            </div>
            <div className="task-list">
              {todoTasks.map(task => (
                <div key={task.id} className="task-card">
                  <span className="task-title">{task.title}</span>
                  <div className="task-actions">
                    <button
                      className="action-btn move-btn"
                      onClick={() => handleMoveTask(task.id, 'done')}
                      title="Mark as Done"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete Task"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <div className="empty-state">
                  <Circle size={32} />
                  <span>Your canvas is clear.</span>
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="column column-done">
            <div className="column-header">
              <div className="column-icon">
                <ClipboardCheck size={24} />
              </div>
              <span className="column-title">Completed</span>
              <span className="task-count">{doneTasks.length}</span>
            </div>
            <div className="task-list">
              {doneTasks.map(task => (
                <div key={task.id} className="task-card done">
                  <span className="task-title">{task.title}</span>
                  <div className="task-actions">
                    <button
                      className="action-btn move-btn"
                      onClick={() => handleMoveTask(task.id, 'todo')}
                      title="Move back to To Do"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete Task"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {doneTasks.length === 0 && (
                <div className="empty-state">
                  <Circle size={32} />
                  <span>No completed tasks yet.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
