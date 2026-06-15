import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info('Server', `TaskGrid API running at http://localhost:${PORT}`);
  logger.info('Server', `Tasks endpoint → http://localhost:${PORT}/api/tasks`);
});