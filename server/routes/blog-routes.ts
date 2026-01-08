import express, { Request, Response, Router } from 'express';
import BlogService from '../services/blog-service';
import { AuthenticatedRequest, Blog, CreateBlogData, UpdateBlogData } from '../types';
import { requireAuth } from '../middlewares/auth';

const blogRouter: Router = express.Router();
const blogService = new BlogService();


blogRouter.route('/').get(async (req: Request, res: Response) => {
  try {
    const blogs: Blog[] = await blogService.getBlogs();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

blogRouter.route('/:id').get(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const blog = await blogService.getBlogById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

blogRouter.route('/').post(requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, user_id }: CreateBlogData = req.body;
    const blog = await blogService.createBlog({ title, content, user_id });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

blogRouter.route('/:id').put(requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, content }: UpdateBlogData = req.body;

    const blog = await blogService.updateBlog(id, { title, content });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

export default blogRouter;