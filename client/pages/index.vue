<template>
  <div class="blogs-page">
    <div class="container">
      <div class="page-header">
        <h1>Blogs</h1>
        <NuxtLink to="/blogs/create" class="create-button">Create Blog</NuxtLink>
      </div>
      
      <div class="blogs-list">
        <div v-if="blogs.length === 0" class="empty-state">
          <p>No blogs yet. Create your first blog post!</p>
        </div>
        <div v-else class="blog-cards">
          <div 
            v-for="blog in blogs" 
            :key="blog.id" 
            class="blog-card"
            @click="navigateToBlog(blog.id)"
          >
            <h2 class="blog-title">{{ blog.title }}</h2>
            <p class="blog-excerpt">{{ blog.excerpt || 'No excerpt available' }}</p>
            <div class="blog-meta">
              <span class="blog-date">{{ formatDate(blog.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Replace with actual API call
const blogs = ref([
  // Example data - replace with actual fetch
])

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

