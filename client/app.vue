<template>
  <div>
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Initialize global auth state
const { initAuth, setupAuthListener } = useAuth()

onBeforeMount(async () => {
  await initAuth()
  setupAuthListener()
})
</script>
