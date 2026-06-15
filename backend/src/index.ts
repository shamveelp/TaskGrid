import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

type Task = {
  id: number;
  title: string;
  status: 'todo' | 'done';
};

let tasks: Task[] = [];
let nextId = 1;

app.get('/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

app.post('/tasks', (req: Request, res: Response): any => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title must not be empty' });
  }

  const newTask: Task = {
    id: nextId++,
    title: title.trim(),
    status: 'todo',
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req: Request<{ id: string }>, res: Response): any => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'todo' && status !== 'done') {
    return res.status(400).json({ error: 'Status must be "todo" or "done"' });
  }

  const task = tasks.find(t => t.id === parseInt(id, 10));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.status = status;
  res.json(task);
});

app.delete('/tasks/:id', (req: Request<{ id: string }>, res: Response): any => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id, 10));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});