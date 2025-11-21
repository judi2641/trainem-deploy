import express from 'express';
import type { Request, Response } from 'express';
import { logger } from './utils/logger';
import cors from 'cors';
import { initDB } from './database/db';
import TaskRoute from './endpoints/tasks/TaskRoute';
import UserRoute from './endpoints/user/UserRoute';
import TrainingsplanRoute from "./endpoints/trainingsplan/TrainingsPlanRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.status(200).json('Hi');
});
app.use('/api/tasks', TaskRoute);
app.use('/api/users', UserRoute);
app.use('/api/trainingsplan', TrainingsplanRoute);

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
