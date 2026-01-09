<template>
  <div class="login-page">
    <div class="container">
      <div class="login-card">
        <!-- Login Form -->
        <div v-if="mode === 'login'">
          <h1>Login</h1>
          <p class="subtitle">Sign in to create blog posts</p>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="Enter your email"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                placeholder="Enter your password"
                class="form-input"
              />
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <button type="submit" class="submit-button" :disabled="isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
          
          <button type="button" @click="mode = 'signup'" class="toggle-button">
            Don't have an account? Sign up
          </button>
        </div>

        <!-- Signup Form -->
        <div v-if="mode === 'signup'">
          <h1>Sign Up</h1>
          <p class="subtitle">Create an account to start blogging</p>

          <form @submit.prevent="handleSignup" class="login-form">
            <div class="form-group">
              <label for="signup-email">Email</label>
              <input
                id="signup-email"
                v-model="signupForm.email"
                type="email"
                required
                placeholder="Enter your email"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="signup-password">Password</label>
              <input
                id="signup-password"
                v-model="signupForm.password"
                type="password"
                required
                placeholder="Create a password (min 6 characters)"
                class="form-input"
                minlength="6"
              />
            </div>

            <div v-if="signupError" class="error-message">
              {{ signupError }}
            </div>

            <div v-if="signupSuccess" class="success-message">
              Account created successfully! You can now log in.
            </div>

            <button type="submit" class="submit-button" :disabled="isSigningUp">
              {{ isSigningUp ? 'Creating account...' : 'Sign Up' }}
            </button>
          </form>
          
          <button type="button" @click="mode = 'login'" class="toggle-button">
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSupabaseClient } from '~/config/supabase-client'

const supabase = getSupabaseClient()
const { setSession, isAuthenticated } = useAuth()

// Redirect if already logged in
const user = ref(null)
onBeforeMount(async () => {
  if (isAuthenticated.value) {
    const redirectTo = useRoute().query.redirect as string || '/'
    await navigateTo(redirectTo)
  }
})

const form = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const isSigningUp = ref(false)
const error = ref<string | null>(null)
const signupError = ref<string | null>(null)
const signupSuccess = ref(false)
const mode = ref<'login' | 'signup'>('login')

const handleLogin = async () => {
  isLoading.value = true
  error.value = null

  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    })

    if (loginError) {
      error.value = loginError.message
      return
    }

    if (data.user && data.session) {
      console.log('data.session', data.session)
      // Update global auth state with the session from response
      await setSession(data.session)
      
      // Redirect to the page they were trying to access, or home
      const redirectTo = useRoute().query.redirect as string || '/'
      await navigateTo(redirectTo)
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  isSigningUp.value = true
  signupError.value = null
  signupSuccess.value = false

  try {
    // Get the current origin for the redirect URL
    const redirectUrl = `${window.location.origin}/auth/callback`
    
    const { data, error: signupErr } = await supabase.auth.signUp({
      email: signupForm.value.email,
      password: signupForm.value.password,
      options: {
        emailRedirectTo: redirectUrl
      }
    })

    if (signupErr) {
      signupError.value = signupErr.message
      return
    }

    if (data.user) {
      // Update global auth state if session exists (usually requires email confirmation)
      if (data.session) {
        await setSession(data.session)
      }
      
      signupSuccess.value = true
      // Clear form
      signupForm.value = { email: '', password: '' }
      
      // Switch to login mode after successful signup
      setTimeout(() => {
        mode.value = 'login'
        signupSuccess.value = false
      }, 2000)
    }
  } catch (err) {
    signupError.value = 'An unexpected error occurred. Please try again.'
    console.error('Signup error:', err)
  } finally {
    isSigningUp.value = false
  }
}
</script>

<style scoped>
.login-page {
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

.login-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.success-message {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-button {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.signup-link {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.signup-link p {
  color: #6b7280;
  font-size: 0.875rem;
}

.signup-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}

.signup-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.signup-section h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.toggle-button {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  text-align: center;
}

.toggle-button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: #f9fafb;
}
</style>

