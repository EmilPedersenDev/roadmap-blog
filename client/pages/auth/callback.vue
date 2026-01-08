<template>
  <div class="callback-page">
    <div class="container">
      <div class="callback-card">
        <div v-if="loading" class="loading-state">
          <h2>Verifying your email...</h2>
          <p>Please wait while we confirm your account.</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <h2>Verification Failed</h2>
          <p>{{ error }}</p>
          <NuxtLink to="/login" class="back-link">Go to login</NuxtLink>
        </div>
        
        <div v-else-if="success" class="success-state">
          <h2>Email Verified!</h2>
          <p>Your account has been confirmed. Redirecting...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSupabaseClient } from '~/config/supabase-client'

const supabase = getSupabaseClient()
const { setSession } = useAuth()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)
const success = ref(false)

onMounted(async () => {
  try {
    const hash = window.location.hash
    if (!hash) return

    const params = new URLSearchParams(hash.slice(1)) // remove leading #
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (!access_token) {
      error.value = 'No verification code or token found in the URL.'
      loading.value = false
      return
    }

  if (access_token && refresh_token) {
    // restore session
    const { data, error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token })
    if (sessionError) {
      error.value = sessionError.message
      loading.value = false
      return
    }
    
    // Update global auth state with the session from response
    if (data.session) {
      await setSession(data.session)
    }
    
    success.value = true
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
    return // redirect to protected page
  }
  } catch (err) {
    error.value = 'An unexpected error occurred during verification.'
    console.error('Callback error:', err)
    loading.value = false
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.callback-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.container {
  width: 100%;
  max-width: 400px;
}

.callback-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}

.loading-state h2,
.error-state h2,
.success-state h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.loading-state p,
.error-state p,
.success-state p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.error-state {
  color: #dc2626;
}

.error-state h2 {
  color: #dc2626;
}

.success-state {
  color: #16a34a;
}

.success-state h2 {
  color: #16a34a;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.back-link:hover {
  background-color: #3b82f6;
  color: white;
}
</style>

