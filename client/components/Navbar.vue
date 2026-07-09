<template>
  <header class="border-b border-charcoal-500 bg-charcoal-900">
    <UContainer>
      <div class="flex items-center justify-between h-16">
        <NuxtLink 
          to="/" 
          class="flex items-center font-bold text-xl text-charcoal-100 hover:text-primary-500 transition-colors"
        >
          Roadmap Blog
        </NuxtLink>

        <nav class="flex items-center gap-6">
          <NuxtLink 
            to="/" 
            class="text-charcoal-200 hover:text-primary-500 font-medium transition-colors"
            active-class="text-primary-500"
          >
            Blogs
          </NuxtLink>

          <NuxtLink
            v-if="!isAuthenticated"
            to="/login"
            class="px-4 py-2 rounded-md bg-primary-500 text-black font-medium hover:bg-primary-400 transition-colors"
          >
            Login
          </NuxtLink>
          <NuxtLink
            v-else
            to="/"
            @click.prevent="handleLogout"
            class="px-4 py-2 rounded-md bg-charcoal-500 text-charcoal-100 font-medium hover:bg-charcoal-400 transition-colors"
          >
            Logout
          </NuxtLink>
        </nav>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const { isAuthenticated, signOut } = useAuth()

const handleLogout = async () => {
  await signOut()
  await navigateTo('/')
}
</script>

