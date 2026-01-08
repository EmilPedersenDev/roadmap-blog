import 'dotenv/config';
import express, { Request, Response } from 'express';
import userRouter from './routes/user-routes';
import blogRouter from './routes/blog-routes';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

const router = express.Router();
router.use('/blogs', blogRouter);
router.use('/users', userRouter);

app.use('/api/v1', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

