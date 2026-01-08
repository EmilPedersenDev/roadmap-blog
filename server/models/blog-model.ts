import { pool } from "../config/database.js";
import { Blog, UpdateBlogData, CreateBlogData } from "../types/index.js";

export class BlogModel {
  async getBlogs(): Promise<Blog[]> {
    const result = await pool.query<Blog>(
      `SELECT * FROM blogs ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async getBlogById(id: number): Promise<Blog | null> {
    const result = await pool.query<Blog>(
      `SELECT * FROM blogs WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async createBlog(data: CreateBlogData): Promise<Blog> {
    const result = await pool.query<Blog>(
      `INSERT INTO blogs (title, content, user_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [data.title, data.content, data.user_id]
    );
    return result.rows[0];
  }

  async updateBlog(id: number, data: UpdateBlogData): Promise<Blog | null> {
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }

    if (data.content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      values.push(data.content);
      paramIndex++;
    }

    if (updates.length === 0) {
      // No updates provided, return the existing blog
      return this.getBlogById(id);
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query<Blog>(
      `UPDATE blogs 
       SET ${updates.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }
}

