import express, { NextFunction, Request, Response, Router } from 'express';
import UserService from '../services/user-service.js';
import { requireAuth } from '../middlewares/auth.js';
import { AuthenticatedRequest } from '../types/index.js';
import { ApiError } from '../common/error.js';

const userRouter: Router = express.Router();
const userService = new UserService();

// Get current authenticated user
userRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError('User not found', 404);
    }
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});


export default userRouter;
