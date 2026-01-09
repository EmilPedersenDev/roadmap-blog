<template>
  <div class="blog-detail-page">
    <div class="container">
      <div class="page-header">
        <NuxtLink to="/" class="back-button">← Back to Blogs</NuxtLink>
      </div>

      <div v-if="loading" class="loading-state">
        <p>Loading blog...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <NuxtLink to="/" class="back-link">Go back to blogs</NuxtLink>
      </div>

      <article v-else-if="blog" class="blog-article">
        <header class="blog-header">
          <h1 class="blog-title">{{ blog.title }}</h1>
          <div class="blog-meta">
            <span class="blog-date">{{ formatDate(blog.created_at) }}</span>
          </div>
        </header>

        <div class="blog-content">
          <p>{{ blog.content || 'No content available.' }}</p>
        </div>
      </article>
    </div>
  </div>
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

<style scoped>
.blog-detail-page {
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.back-button {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 1rem;
}

.back-button:hover {
  color: #3b82f6;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.error-state {
  color: #ef4444;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.blog-article {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
}

.blog-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.blog-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.blog-date {
  color: #9ca3af;
}

.blog-excerpt {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-left: 4px solid #3b82f6;
  border-radius: 0.25rem;
}

.blog-excerpt p {
  font-size: 1.125rem;
  color: #4b5563;
  font-style: italic;
  margin: 0;
}

.blog-content {
  line-height: 1.8;
  color: #374151;
  font-size: 1.125rem;
}

.blog-content p {
  margin-bottom: 1.5rem;
}

.blog-content p:last-child {
  margin-bottom: 0;
}
</style>

