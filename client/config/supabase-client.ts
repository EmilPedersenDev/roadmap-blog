import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

// Must be called inside a composable or setup function
export const createSupabaseClient = () => {
  const config = useRuntimeConfig()

  console.log('createSupabaseClient', config.public.supabaseUrl, config.public.supabaseKey);

  if (!config.public.supabaseUrl || !config.public.supabaseKey) {
    throw new Error('Supabase env variables are not defined!')
  }

  return createClient(config.public.supabaseUrl, config.public.supabaseKey)
}