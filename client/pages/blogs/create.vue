<template>
  <UContainer class="py-8">
    <ClientOnly>
      <div v-if="checkingAuth" class="flex flex-col items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-4" />
        <p class="text-white">Loading...</p>
      </div>

      <div v-else-if="!checkingAuth && isAuthenticated">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-4xl font-bold text-white">Create Blog</h1>
          <UButton
            to="/"
            variant="ghost"
            color="neutral"
            icon="i-heroicons-arrow-left"
            class="text-white hover:text-primary-500"
          >
            Back to Blogs
          </UButton>
        </div>

        <UCard class="bg-charcoal-900 border-charcoal-500">
          <UForm @submit="handleSubmit" class="space-y-6 flex flex-col items-center justify-center">
            <UFormGroup label="Title" name="title" required>
              <UInput
                v-model="form.title"
                placeholder="Enter blog title"
                size="lg"
                class="bg-charcoal-800 border-charcoal-500 text-white"
                required
              />
            </UFormGroup>

            <UFormGroup label="Content" name="content" required class="w-full flex flex-col items-center justify-center">
              <UTextarea
                v-model="form.content"
                placeholder="Write your blog content here..."
                :rows="15"
                size="lg"
                class="bg-charcoal-800 border-charcoal-500 text-white w-1/2"
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

            <div class="flex justify-center gap-4 pt-4 border-t border-charcoal-500">
              <UButton
                type="button"
                @click="handleCancel"
                variant="ghost"
                color="neutral"
                class="text-white"
              >
                Cancel
              </UButton>
              <UButton
                type="submit"
                color="primary"
                :loading="isSubmitting"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Creating...' : 'Create Blog' }}
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>

      <template #fallback>
        <div class="flex flex-col items-center justify-center py-16">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-4" />
          <p class="text-white">Loading...</p>
        </div>
      </template>
    </ClientOnly>
  </UContainer>
</template>

<script setup lang="ts">
const { isAuthenticated, loading, user } = useAuth()
const { createBlog } = useBlogStore()
const route = useRoute()
const checkingAuth = computed(() => loading.value)

// Check authentication when loading is complete
watch(loading, async (isLoading) => {
  if (!isLoading && !isAuthenticated.value) {
    // Redirect to login with the current page as redirect target
    await navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
  }
}, { immediate: true })

const form = ref({
  title: '',
  content: ''
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  if (!user.value) {
    error.value = 'User not authenticated'
    return
  }

  error.value = null
  isSubmitting.value = true
  try {
    await createBlog({
      title: form.value.title,
      content: form.value.content,
      user_id: user.value.id
    })
    
    // Navigate to blogs page after successful creation
    navigateTo('/')
  } catch (err: any) {
    console.error('Error creating blog:', err)
    error.value = err.message || 'Failed to create blog. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  navigateTo('/')
}
</script>


