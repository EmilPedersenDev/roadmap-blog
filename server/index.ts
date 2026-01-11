import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user-routes.js';
import blogRouter from './routes/blog-routes.js';
import ErrorHandler from "./middlewares/error-handler.js";

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

const PORT = process.env.PORT || 3001;

const router = express.Router();
router.use('/blogs', blogRouter);
router.use('/users', userRouter);

app.use('/api/v1', router);

app.use(ErrorHandler.handleError);
process.on('uncaughtException', ErrorHandler.handleUncaughtError);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

