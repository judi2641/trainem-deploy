import express from 'express';
import type { Request, Response } from 'express';
import { logger } from './utils/logger';
import cors from 'cors';
import { initDB } from './database/db';
import UserRoute from './endpoints/users/UserRoute';
import TrainingsplanRoute from './endpoints/routes/TrainingsPlanRoute';
import CompletedTaskRoute from './endpoints/routes/CompletedTaskRoute';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.status(200).json('Hi');
});
app.use('/api/user', UserRoute);
app.use('/api/trainingsplan', TrainingsplanRoute);
app.use('/api/completedTasks', CompletedTaskRoute);

async function startServer() {
	try {
		await initDB();
		app.listen(3000, () => {
			logger.info('server is running on port 3000');
		});
	} catch (error) {
		logger.error('serverstart failed:', error);
	}
}

startServer();
