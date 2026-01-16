<template>
  <UContainer class="py-16">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-8">
        <UIcon 
          name="i-heroicons-check-circle" 
          class="w-20 h-20 text-green-500 mx-auto mb-4" 
        />
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Thank you for upgrading to Premium. Your subscription is now active.
        </p>
      </div>

      <UCard class="mb-8">
        <div class="space-y-4">
          <div class="flex items-center justify-center gap-2">
            <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-primary" />
            <p class="text-lg font-semibold text-gray-900">
              You now have access to unlimited blog articles!
            </p>
          </div>
          <p class="text-gray-600">
            Start creating as many blog posts as you want. There are no limits on your creativity.
          </p>
        </div>
      </UCard>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton 
          to="/profile" 
          color="primary" 
          size="lg"
          icon="i-heroicons-user-circle"
        >
          View Profile
        </UButton>
        <UButton 
          to="/blogs/create" 
          variant="outline" 
          size="lg"
          icon="i-heroicons-plus"
        >
          Create Your First Blog
        </UButton>
      </div>

      <div v-if="sessionId" class="mt-8 text-sm text-gray-500">
        <p>Session ID: {{ sessionId }}</p>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const sessionId = computed(() => route.query.session_id as string | undefined)

// Optionally verify the session on the backend
onMounted(async () => {
  if (sessionId.value) {
    console.log('Checkout session ID:', sessionId.value)
  }
})
</script>
