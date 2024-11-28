import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrowhandler';
import notFound from './app/middlewares/notFound';
const app: Application = express();
// const port = 3000;

// parsers
app.use(express.json());
app.use(cors());

// application route
app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRoutes);

app.get('/', (req: Request, res: Response) => {});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
