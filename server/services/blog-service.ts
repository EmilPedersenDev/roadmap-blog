import { BlogModel } from "../models/blog-model.js";
import { Blog, CreateBlogData, UpdateBlogData } from "../types/index.js";

class BlogService {
  private blogModel: BlogModel;

  constructor() {
    this.blogModel = new BlogModel();
  }

  async getBlogs(): Promise<Blog[]> {
    return this.blogModel.getBlogs();
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