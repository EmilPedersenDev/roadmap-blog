import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface Blog {
  id: number
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at?: string
}

export enum Tier {
  FREE = 'free',
  PREMIUM = 'premium',
}

export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  tier: Tier
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  stripe_subscription_status?: string | null
}

export type CombinedUser = SupabaseUser & Partial<User>