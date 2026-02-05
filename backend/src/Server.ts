import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import type { Request, Response } from 'express';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
import cors from 'cors';
import { initDB } from './database/db';
import UserRoute from './endpoints/users/UserRoute';
// import TrainingsplanRoute from './endpoints/routes/TrainingsPlanRoute';
// import CompletedTaskRoute from './endpoints/routes/CompletedTaskRoute';
import WorkoutRoute from './endpoints/workouts/WorkoutRoute';
import HabitRoute from './endpoints/habits/HabitRoute';
import EntryRoute from './endpoints/entries/EntryRoute';
import ExerciseRoute from './endpoints/exercises/ExerciseRoute';
import PixelArtRoute from './endpoints/pixelArt/PixelArtRoute';
import GroupRoute from './endpoints/groups/GroupRoute';
import PixelWarRoute from './endpoints/pixelwar/PixelWarRoute';
import BattleRoute from './endpoints/pixelwar/BattleRoute';
import { checkAuth0Token } from './utils/checkAuth0Token';

const openapi_path = path.resolve(__dirname, '../openAPI/openapi.yaml');
console.log(openapi_path);
const file = fs.readFileSync(openapi_path, 'utf8');
const swaggerDocument = YAML.parse(file);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.status(200).json('Hi');
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', checkAuth0Token);
app.use('/api/user', UserRoute);
app.use('/api/workouts', WorkoutRoute);
app.use('/api/habits', HabitRoute);
app.use('/api/entries', EntryRoute);
app.use('/api/exercises', ExerciseRoute);
app.use('/api/pixel-art', PixelArtRoute);
app.use('/api/groups', GroupRoute);
app.use('/api/pixelwar', PixelWarRoute);
app.use('/api/pixelwar/battles', BattleRoute);

async function startServer() {
	try {
		//await initDB();
		app.listen(3000, () => {
			logger.info('server is running on port 3000');
		});
	} catch (error) {
		logger.error('serverstart failed:', error);
	}
}

startServer();
