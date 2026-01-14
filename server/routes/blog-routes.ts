import express, { NextFunction, Request, Response, Router } from 'express';
import BlogService from '../services/blog-service.js';
import { AuthenticatedRequest, Blog, CreateBlogData, UpdateBlogData } from '../types/index.js';
import { requireAuth } from '../middlewares/auth.js';
import logger from "../config/logger.js";
import { ApiError } from '../common/error.js';
import { blogQueryValidator, blogIdValidator, createBlogValidator, updateBlogValidator, validate } from "../middlewares/validator.js";

const blogRouter: Router = express.Router();
const blogService = new BlogService();
const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

blogRouter.route('/').get(blogQueryValidator, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offset = Number(req.query.offset) || DEFAULT_OFFSET;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const result = await blogService.getBlogs(offset, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

blogRouter.route('/:id').get(blogIdValidator, validate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const blog = await blogService.getBlogById(id);

    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

blogRouter.route('/').post(requireAuth, createBlogValidator, validate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, user_id }: CreateBlogData = req.body;
    const blog = await blogService.createBlog({ title, content, user_id });
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

blogRouter.route('/:id').put(requireAuth, updateBlogValidator, validate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
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
