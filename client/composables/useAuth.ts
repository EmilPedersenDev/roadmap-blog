import { getSupabaseClient } from '~/config/supabase-client'
import type { User, Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const supabase = getSupabaseClient()

  // Global state for user and session
  const user = useState<User | null>('auth_user', () => null)
  const session = useState<Session | null>('auth_session', () => null)
  const loading = useState<boolean>('auth_loading', () => true)

  // Initialize auth state
  const initAuth = async () => {
    try {
      loading.value = true

      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      session.value = currentSession
      user.value = currentSession?.user ?? null
    } catch (error) {
      console.error('Error initializing auth:', error)
      session.value = null
      user.value = null
    } finally {
      loading.value = false
    }
  }

  // Listen for auth state changes
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value && !!session.value)

  // Set session and user (useful after login/signup)
  const setSession = async (newSession: Session | null) => {
    session.value = newSession
    user.value = newSession?.user ?? null
  }

  // Refresh auth state (useful after login/signup)
  const refreshAuth = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      await setSession(currentSession)
    } catch (error) {
      console.error('Error refreshing auth:', error)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null
      session.value = null
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return {
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    isAuthenticated,
    initAuth,
    setupAuthListener,
    setSession,
    refreshAuth,
    signOut
  }
}

