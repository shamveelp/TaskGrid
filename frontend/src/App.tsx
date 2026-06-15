import { Circle, CheckCircle2 } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import Header from './components/Header';
import AddTaskForm from './components/AddTaskForm';
import TaskColumn from './components/TaskColumn';
import ErrorBanner from './components/ErrorBanner';
import './App.css';

export default function App() {
  const { tasks, loading, error, addTask, moveTask, deleteTask } = useTasks();

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="app">
      <Header todoCount={todoTasks.length} doneCount={doneTasks.length} />

      {error && <ErrorBanner message={error} />}

      <AddTaskForm onAdd={addTask} />

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="board">
          <TaskColumn
            title="In Progress"
            tasks={todoTasks}
            columnClass="col-todo"
            emptyIcon={<Circle size={36} />}
            emptyText="All clear - add something to start."
            onMove={moveTask}
            onDelete={deleteTask}
          />
          <TaskColumn
            title="Completed"
            tasks={doneTasks}
            columnClass="col-done"
            emptyIcon={<CheckCircle2 size={36} />}
            emptyText="Nothing here yet - keep going!"
            onMove={moveTask}
            onDelete={deleteTask}
          />
        </div>
      )}
    </div>
  );
}
