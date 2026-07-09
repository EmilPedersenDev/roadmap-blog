<template>
  <UContainer class="py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-bold text-white">Blogs</h1>
      <UButton to="/blogs/create" color="primary" icon="i-heroicons-plus">
        Create Blog
      </UButton>
    </div>

    <ClientOnly>
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-4" />
        <p class="text-white">Loading blogs...</p>
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
            class="cursor-pointer hover:shadow-lg transition-shadow bg-charcoal-900 border-charcoal-500"
            @click="navigateToBlog(blog.id)"
          >
            <template #header>
              <h2 class="text-xl font-semibold text-white">{{ blog.title }}</h2>
            </template>
            <template #footer>
              <div class="text-sm text-charcoal-200">
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
            color="primary"
            @update:page="handlePageChange"
          />
        </div>
      </div>
      <template #fallback>
        <div class="flex flex-col items-center justify-center py-16">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-4" />
          <p class="text-white">Loading blogs...</p>
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

</style>
