<template>
  <div class="min-h-screen flex items-center justify-center py-8">
    <UContainer class="max-w-md">
      <UCard class="bg-charcoal-900 border-charcoal-500">
        <!-- Login Form -->
        <div v-if="mode === 'login'">
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-white mb-2">Login</h1>
            <p class="text-charcoal-200">Sign in to create blog posts</p>
          </div>

          <UForm @submit="handleLogin" class="space-y-4">
            <UFormGroup label="Email" name="email" required>
              <UInput
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                size="lg"
                class="bg-charcoal-800 border-charcoal-500 text-white w-full"
                required
              />
            </UFormGroup>

            <UFormGroup label="Password" name="password" required>
              <UInput
                v-model="form.password"
                type="password"
                placeholder="Enter your password"
                size="lg"
                class="bg-charcoal-800 border-charcoal-500 text-white w-full  py-2"
                required
              />
            </UFormGroup>

            <UAlert
              v-if="error"
              color="error"
              variant="soft"
              :title="error"
              class="mb-4"
            />

            <UButton
              type="submit"
              color="primary"
              size="lg"
              block
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </UButton>
          </UForm>
          
          <div class="mt-6 pt-6 border-t border-charcoal-500">
            <UButton
              type="button"
              @click="mode = 'signup'"
              variant="ghost"
              color="neutral"
              block
              class="text-white hover:text-primary-500"
            >
              Don't have an account? Sign up
            </UButton>
          </div>
        </div>

        <!-- Signup Form -->
        <div v-if="mode === 'signup'">
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-white mb-2">Sign Up</h1>
            <p class="text-charcoal-200">Create an account to start blogging</p>
          </div>

          <UForm @submit="handleSignup" class="space-y-4">
            <UFormGroup label="Email" name="signup-email" required>
              <UInput
                v-model="signupForm.email"
                type="email"
                placeholder="Enter your email"
                size="lg"
                class="bg-charcoal-800 border-charcoal-500 text-white w-full"
                required
              />
            </UFormGroup>

            <UFormGroup label="Password" name="signup-password" required>
              <UInput
                v-model="signupForm.password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                size="lg"
                class="bg-charcoal-800 border-charcoal-500 text-white w-full py-2"
                required
                minlength="6"
              />
            </UFormGroup>

            <UAlert
              v-if="signupError"
              color="error"
              variant="soft"
              :title="signupError"
              class="mb-4"
            />

            <UAlert
              v-if="signupSuccess"
              color="success"
              variant="soft"
              title="Account created successfully!"
              description="You can now log in."
              class="mb-4"
            />

            <UButton
              type="submit"
              color="primary"
              size="lg"
              block
              :loading="isSigningUp"
              :disabled="isSigningUp"
            >
              {{ isSigningUp ? 'Creating account...' : 'Sign Up' }}
            </UButton>
          </UForm>
          
          <div class="mt-6 pt-6 border-t border-charcoal-500">
            <UButton
              type="button"
              @click="mode = 'login'"
              variant="ghost"
              color="neutral"
              block
              class="text-white hover:text-primary-500"
            >
              Already have an account? Login
            </UButton>
          </div>
        </div>
      </UCard>
    </UContainer>
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


