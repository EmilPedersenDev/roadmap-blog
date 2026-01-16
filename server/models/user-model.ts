import { pool } from "../config/database.js";
import { User } from "../types/index.js";

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

  async updateUserSubscription(
    userId: string,
    updates: {
      tier?: string;
      stripe_customer_id?: string | null;
      stripe_subscription_id?: string | null;
      stripe_subscription_status?: string | null;
    }
  ): Promise<User | null> {
    const updatesArray: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.tier !== undefined) {
      updatesArray.push(`tier = $${paramIndex}`);
      values.push(updates.tier);
      paramIndex++;
    }
    if (updates.stripe_customer_id !== undefined) {
      updatesArray.push(`stripe_customer_id = $${paramIndex}`);
      values.push(updates.stripe_customer_id);
      paramIndex++;
    }
    if (updates.stripe_subscription_id !== undefined) {
      updatesArray.push(`stripe_subscription_id = $${paramIndex}`);
      values.push(updates.stripe_subscription_id);
      paramIndex++;
    }
    if (updates.stripe_subscription_status !== undefined) {
      updatesArray.push(`stripe_subscription_status = $${paramIndex}`);
      values.push(updates.stripe_subscription_status);
      paramIndex++;
    }

    if (updatesArray.length === 0) {
      return this.getUser(userId);
    }

    values.push(userId);
    const query = `
      UPDATE users 
      SET ${updatesArray.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query<User>(query, values);
    return result.rows[0] || null;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | null> {
    const result = await pool.query<User>(
      `SELECT * FROM users WHERE stripe_customer_id = $1`,
      [customerId]
    );
    return result.rows[0] || null;
  }
}

