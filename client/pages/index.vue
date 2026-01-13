<template>
  <UContainer class="py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-bold text-gray-900">Blogs</h1>
      <UButton to="/blogs/create" color="primary" icon="i-heroicons-plus">
        Create Blog
      </UButton>
    </div>

    <ClientOnly>
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary mb-4" />
        <p class="text-gray-600">Loading blogs...</p>
      </div>
      <UAlert
        v-else-if="blogs.length === 0"
        color="neutral"
        variant="soft"
        title="No blogs yet"
        description="Create your first blog post!"
        class="mb-4"
      />
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <UCard
            v-for="blog in blogs"
            :key="blog.id"
            class="cursor-pointer hover:shadow-lg transition-shadow"
            @click="navigateToBlog(blog.id)"
          >
            <template #header>
              <h2 class="text-xl font-semibold text-gray-900">{{ blog.title }}</h2>
            </template>
            <template #footer>
              <div class="text-sm text-gray-500">
                {{ formatDate(blog.created_at) }}
              </div>
            </template>
          </UCard>
        </div>

        <div v-if="total >= 10" class="flex justify-center">
          <UPagination
            v-model:page="page"
            :total="total"
            :page-size="pageSize"
            :max="7"
            @update:page="handlePageChange"
          />
        </div>
      </div>
      <template #fallback>
        <div class="flex flex-col items-center justify-center py-16">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary mb-4" />
          <p class="text-gray-600">Loading blogs...</p>
        </div>
      </template>
    </ClientOnly>
  </UContainer>
</template>

<script setup lang="ts">
const { blogs, loading, currentPage, pageSize, total, fetchBlogs } = useBlogStore()

const page = ref(currentPage.value)

// Sync page with currentPage from store
watch(currentPage, (newPage) => {
  page.value = newPage
})

onBeforeMount(async () => {
  await fetchBlogs(page.value, pageSize.value)
})

const handlePageChange = async (newPage: number) => {
  if (newPage === currentPage.value) {
    return // Already on this page
  }
  page.value = newPage
  await fetchBlogs(newPage, pageSize.value, true)
  // Scroll to top on page change
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const navigateToBlog = (id: number) => {
  navigateTo(`/blogs/${id}`)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.blogs-page {
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
}

.create-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #2563eb;
}

.blogs-list {
  margin-top: 2rem;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1rem;
}

.spinner {
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.blog-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.blog-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.blog-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.blog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.blog-excerpt {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #9ca3af;
}

.blog-date {
  font-size: 0.875rem;
}
</style>
