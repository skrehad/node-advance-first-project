import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrowhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();
// const port = 3000;

// parsers
app.use(express.json());
app.use(cors());

// application route
app.use('/api/v1', router);

// const test = (req: Request, res: Response) => {
//   const a = 10;
//   res.send(a);
// };

app.get('/');

app.use(globalErrorHandler);
app.use(notFound);

export default app;
