<template>
  <UContainer class="py-8">
    <div class="mb-6">
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

    <ClientOnly>
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-4" />
        <p class="text-white">Loading blog...</p>
      </div>

      <UAlert
        v-else-if="error"
        color="error"
        variant="soft"
        :title="error"
        :description="'Please try again later or go back to the blogs list.'"
        class="mb-4"
      >
        <template #actions>
          <UButton to="/" color="primary" size="xs">
            Go back to blogs
          </UButton>
        </template>
      </UAlert>

      <UCard
        v-else-if="blog"
        class="bg-charcoal-900 border-charcoal-500"
      >
        <template #header>
          <div class="space-y-4">
            <h1 class="text-4xl font-bold text-white">{{ blog.title }}</h1>
            <div class="flex items-center gap-2 text-charcoal-200 text-sm">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              <span>{{ formatDate(blog.created_at) }}</span>
            </div>
          </div>
        </template>

        <div class="prose prose-invert max-w-none">
          <p class="text-white text-lg leading-relaxed whitespace-pre-wrap">
            {{ blog.content || 'No content available.' }}
          </p>
        </div>
      </UCard>

      <template #fallback>
        <div class="flex flex-col items-center justify-center py-16">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-4" />
          <p class="text-white">Loading blog...</p>
        </div>
      </template>
    </ClientOnly>
  </UContainer>
</template>

<script setup lang="ts">
import type { Blog } from '~/types'

const route = useRoute()
const { getBlog, loadingBlog } = useBlogStore()
const blogId = computed(() => parseInt(route.params.id as string, 10))

const blog = ref<Blog | null>(null)
const error = ref<string | null>(null)

const loading = computed(() => loadingBlog.value === blogId.value)

onMounted(async () => {
  try {
    const data = await getBlog(blogId.value)
    blog.value = data
  } catch (err: any) {
    error.value = err.message || 'Failed to load blog post. Please try again later.'
    console.error('Error loading blog:', err)
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>


