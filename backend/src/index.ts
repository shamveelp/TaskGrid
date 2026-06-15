import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[TaskGrid] Server running at http://localhost:${PORT}`);
  console.log(`[TaskGrid] API available at http://localhost:${PORT}/api/tasks`);
});