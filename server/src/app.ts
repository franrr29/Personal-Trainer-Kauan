import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { db } from './config/db';
import passport from 'passport';
import './config/passport';
import authRoutes from './modules/auth/auth.routes';
import routinesRoutes from './modules/routines/routines.routes';
import studentsRoutes from './modules/students/students.routes';
import exercisesRoutes from './modules/exercises/exercise.routes';
import routineExercises from './modules/routinesExcercises/routine_ex.route';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(helmet());

//Health check endpoint
app.get('/health', async (req: express.Request, res: express.Response) => {
    try {
        await db.getConnection(); 
        res.status(200).json({ status: 'ok', 
          message: 'Server is healthy and database connection is successful.' });
    } catch (error ) {
        res.status(500).json({ status: 'error', 
          message: 'Server is healthy but database connection failed.', error : (error as Error).message });
    }
});


app.use('/api/auth', authRoutes);
app.use('/api/routines', routinesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/routine-exercises', routineExercises);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;