<template>
  <UContainer class="py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary mb-4" />
        <p class="text-gray-600">Loading profile...</p>
      </div>

      <UAlert
        v-else-if="error"
        color="error"
        variant="soft"
        :title="error"
        class="mb-6"
      />

      <div v-else-if="user" class="space-y-6">
        <!-- User Information -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900">User Information</h2>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Email
              </label>
              <p class="text-gray-900">{{ user.email }}</p>
            </div>
            <div v-if="user.first_name || user.last_name">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Name
              </label>
              <p class="text-gray-900">{{ fullName }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Subscription Tier
              </label>
              <UBadge 
                :color="isPremium ? 'primary' : 'warning'"
                variant="soft"
                size="lg"
              >
                {{ isPremium ? 'Premium' : 'Free' }}
              </UBadge>
            </div>
          </div>
        </UCard>

        <!-- Subscription Section -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900">Subscription</h2>
          </template>
          
          <div v-if="!isPremium" class="space-y-4">
            <div class="space-y-3">
              <p class="text-gray-700 leading-relaxed">
                You're currently on the <strong>Free</strong> tier. You can create up to <strong>10 blog articles</strong>.
              </p>
              <p class="text-green-600 font-medium leading-relaxed">
                Upgrade to <strong>Premium</strong> to create <strong>unlimited blog articles</strong>!
              </p>
            </div>
            <UButton 
              @click="handleUpgrade" 
              color="primary"
              size="lg"
              block
              :loading="isUpgrading"
              :disabled="isUpgrading"
            >
              {{ isUpgrading ? 'Processing...' : 'Upgrade to Premium' }}
            </UButton>
          </div>

          <div v-else class="space-y-4">
            <div class="space-y-3">
              <p class="text-gray-700 leading-relaxed">
                You're on the <strong>Premium</strong> tier! 🎉
              </p>
              <p class="text-blue-600 font-medium leading-relaxed">
                You can create <strong>unlimited blog articles</strong>.
              </p>
            </div>
            <div v-if="user.stripe_subscription_status" class="pt-4 border-t border-gray-200">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Subscription Status
              </label>
              <p class="text-gray-900 capitalize">{{ user.stripe_subscription_status }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { CombinedUser } from '~/types'
import { Tier } from '~/types'

const { isAuthenticated, user, loading } = useAuth()
const { post } = useApi()
const route = useRoute()


// Check authentication when loading is complete
watch(loading, async (isLoading) => {
  if (!isLoading && !isAuthenticated.value) {
    await navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
  }
}, { immediate: true })

const error = ref<string | null>(null)
const isUpgrading = ref(false)

const fullName = computed(() => {
  if (!user.value) return ''
  const parts = [user.value.first_name, user.value.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Not set'
})

const isPremium = computed(() => {
  if (!user.value?.tier) return false
  const tier = String(user.value.tier).toLowerCase()
  return tier === 'premium'
})

const handleUpgrade = async () => {
  try {
    isUpgrading.value = true
    error.value = null
    
    // Get the checkout URL from the server
    const response = await post<{ url: string }>('/subscriptions', {}, true)
    
    // Redirect to Stripe checkout (fetch doesn't follow redirects in a way that changes browser location)
    if (response?.url) {
      window.location.href = response.url
    } else {
      throw new Error('No checkout URL received')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to start upgrade process'
    console.error('Error creating checkout session:', err)
    isUpgrading.value = false
  }
}
</script>
