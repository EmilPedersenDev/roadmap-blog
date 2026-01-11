import express, { NextFunction, Request, Response, Router } from 'express';
import BlogService from '../services/blog-service.js';
import { AuthenticatedRequest, Blog, CreateBlogData, UpdateBlogData } from '../types/index.js';
import { requireAuth } from '../middlewares/auth.js';
import logger from "../config/logger.js";
import { ApiError } from '../common/error.js';

const blogRouter: Router = express.Router();
const blogService = new BlogService();


blogRouter.route('/').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs: Blog[] = await blogService.getBlogs();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.route('/:id').get(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new ApiError('Invalid blog ID', 400);
    }

    const blog = await blogService.getBlogById(id);

    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

blogRouter.route('/').post(requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, user_id }: CreateBlogData = req.body;

    if (!title || !content || !user_id) {
      throw new ApiError('Missing required fields: title, content, user_id', 400);
    }

    const blog = await blogService.createBlog({ title, content, user_id });
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

blogRouter.route('/:id').put(requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new ApiError('Invalid blog ID', 400);
    }

    const { title, content }: UpdateBlogData = req.body;

    const blog = await blogService.updateBlog(id, { title, content });

    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
