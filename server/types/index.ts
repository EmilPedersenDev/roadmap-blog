export interface Blog {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBlogData {
  title: string;
  content: string;
  user_id: string;
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  auth?: {
    supabaseUserId: string
    email?: string
  }
  user?: User
}