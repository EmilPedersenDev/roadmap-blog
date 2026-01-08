import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.DATABASE_PORT || 3001;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

