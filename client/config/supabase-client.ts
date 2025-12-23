import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

// Singleton instance
let supabaseInstance: SupabaseClient | null = null

// Must be called inside a composable or setup function
export const getSupabaseClient = (): SupabaseClient => {
  // Return existing instance if already created
  if (supabaseInstance) {
    return supabaseInstance
  }

  const config = useRuntimeConfig()

  console.log('getSupabaseClient', config.public.supabaseUrl, config.public.supabaseKey);

  if (!config.public.supabaseUrl || !config.public.supabaseKey) {
    throw new Error('Supabase env variables are not defined!')
  }

  // Create and cache the instance
  supabaseInstance = createClient(config.public.supabaseUrl, config.public.supabaseKey)

  return supabaseInstance
}