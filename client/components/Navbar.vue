<template>
  <nav class="navbar">
    <div class="navbar-container">
      <NuxtLink to="/" class="navbar-brand">Roadmap Blog</NuxtLink>
      <div class="navbar-links">
        <NuxtLink to="/" class="navbar-link">Blogs</NuxtLink>
        <NuxtLink 
          v-if="isAuthenticated"
          to="/profile" 
          class="navbar-link"
        >
          Profile
        </NuxtLink>
        <NuxtLink 
          v-if="!isAuthenticated"
          to="/login" 
          class="login-button"
        >
          Login
        </NuxtLink>
        <button
          v-else
          @click="handleLogout"
          class="login-button logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { isAuthenticated, signOut } = useAuth()

const handleLogout = async () => {
  await signOut()
  await navigateTo('/')
}
</script>

<style scoped>
.navbar {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  text-decoration: none;
  transition: color 0.2s;
}

.navbar-brand:hover {
  color: #3b82f6;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.navbar-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 0;
}

.navbar-link:hover {
  color: #3b82f6;
}

.navbar-link.router-link-active {
  color: #3b82f6;
}

.login-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  background-color: #3b82f6;
  color: white;
}

.login-button:hover {
  background-color: #2563eb;
}

.logout-button {
  background-color: #6b7280;
}

.logout-button:hover {
  background-color: #4b5563;
}
</style>

