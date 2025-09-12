import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { env } from './config/env.config';
import { ErrorMsg } from './utils/constants/commonErrorMsg.constants';
import { SuccessMsg } from './utils/constants/commonSuccessMsg.constants';
import { connectDB } from './infrastructure/database/mongoose';
import errorHandler from './presentation/middlewares/errorHandler.middleware';
import { requestLogger } from './presentation/middlewares/logger.middleware';

const app = express();

app.use(
  cors({
    origin: [env.CLIENT_ORIGIN],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());


// Import and use routes
import userAuthRoutes from './presentation/routes/userAuth.routes';
app.use('/api/auth', userAuthRoutes);

app.use(requestLogger);
app.use(errorHandler);


const PORT = env.PORT;
const startServer = async () => {
  try {
    await connectDB();
    const server = createServer(app);

    server.listen(PORT, () => {
      console.log(`${SuccessMsg.SERVER_RUNNING} ${PORT} 🚀`);
    });
  } catch (error) {
    console.error(ErrorMsg.FAILED_START_SERVER, error);
    process.exit(1);
  }
};

startServer();