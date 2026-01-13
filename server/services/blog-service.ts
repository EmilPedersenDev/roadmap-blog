import { BlogModel } from "../models/blog-model.js";
import { Blog, CreateBlogData, UpdateBlogData } from "../types/index.js";

class BlogService {
  private blogModel: BlogModel;

  constructor() {
    this.blogModel = new BlogModel();
  }

  async getBlogs(offset: number, limit: number): Promise<{ blogs: Blog[]; total: number }> {
    return this.blogModel.getBlogs(offset, limit);
  }

  async getBlogById(id: number): Promise<Blog | null> {
    return this.blogModel.getBlogById(id);
  }

  async createBlog(data: CreateBlogData): Promise<Blog> {
    return this.blogModel.createBlog(data);
  }

  async updateBlog(id: number, data: UpdateBlogData): Promise<Blog | null> {
    return this.blogModel.updateBlog(id, data);
  }
}

export default BlogService;