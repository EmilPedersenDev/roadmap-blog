import express, { Request, Response, Router } from 'express';
import UserService from '../services/user-service.js';
import { requireAuth } from '../middlewares/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

const userRouter: Router = express.Router();
const userService = new UserService();

userRouter.route('/:id').get(requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.getUser(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }

})

export default userRouter;
