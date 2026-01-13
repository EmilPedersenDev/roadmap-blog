<template>
  <div>
    <UApp>
      <Navbar />
      <NuxtPage />
    </UApp>
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
