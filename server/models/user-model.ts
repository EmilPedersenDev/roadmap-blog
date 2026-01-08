import { pool } from "../config/database";
import { User } from "../types";

export class UserModel {
  async getUser(id: string): Promise<User | null> {
    const result = await pool.query<User>(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async createUser(user: User): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (id, email, first_name, last_name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [user.id, user.email, user.first_name ?? null, user.last_name ?? null]
    );
    return result.rows[0];
  }
}

