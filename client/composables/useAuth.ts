import { getSupabaseClient } from '~/config/supabase-client'
import type { CombinedUser } from '~/types'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import type { User as BackendUser } from '~/types'


export const useAuth = () => {
  const supabase = getSupabaseClient()

  // Global state for user and session
  const user = useState<CombinedUser | null>('auth_user', () => null)
  const session = useState<Session | null>('auth_session', () => null)
  const loading = useState<boolean>('auth_loading', () => true)

  // Fetch backend user data and merge with Supabase user
  const fetchBackendUserData = async (supabaseUser: SupabaseUser): Promise<CombinedUser> => {
    try {
      const { get } = useApi()
      const backendUser = await get<BackendUser>('/users/me', true)

      // Merge backend user data with Supabase user
      return {
        ...supabaseUser,
        ...backendUser,
      }
    } catch (error) {
      console.error('Error fetching backend user data:', error)
      // Return Supabase user only if backend fetch fails
      return supabaseUser
    }
  }

  // Initialize auth state
  const initAuth = async () => {
    try {
      loading.value = true

      // Get current session from browser storage
      // Supabase automatically stores sessions in localStorage when users log in
      // This method retrieves the stored session for the current browser/domain
      // No user ID needed - it reads from the browser's storage
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      session.value = currentSession

      if (currentSession?.user) {
        // Fetch backend user data and merge with Supabase user
        const combinedUser = await fetchBackendUserData(currentSession.user)
        user.value = combinedUser
      } else {
        user.value = null
      }

      console.log('user', user.value, 'session', session.value)
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
    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      const currentUserId = user.value?.id
      const newUserId = newSession?.user?.id

      session.value = newSession

      if (newSession?.user) {
        // Only fetch backend user data if it's a new user (different session)
        // If it's the same user, keep the existing user data (which already has backend data merged)
        if (currentUserId !== newUserId) {
          // New user - fetch backend user data and merge with Supabase user
          const combinedUser = await fetchBackendUserData(newSession.user)
          user.value = combinedUser
        }
        // If same user, keep existing user.value (no need to refetch backend data)
      } else {
        user.value = null
      }
    })
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value && !!session.value)

  // Set session and user (useful after login/signup)
  const setSession = async (newSession: Session | null) => {
    session.value = newSession

    if (newSession?.user) {
      // Fetch backend user data and merge with Supabase user
      const combinedUser = await fetchBackendUserData(newSession.user)
      user.value = combinedUser
    } else {
      user.value = null
    }
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

