<template>
  <UContainer class="py-16">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-8">
        <UIcon 
          name="i-heroicons-x-circle" 
          class="w-20 h-20 text-gray-400 mx-auto mb-4" 
        />
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Your subscription upgrade was cancelled. No charges were made.
        </p>
      </div>

      <UCard class="mb-8">
        <div class="space-y-4">
          <p class="text-gray-700">
            You're still on the <strong>Free</strong> tier with access to create up to <strong>10 blog articles</strong>.
          </p>
          <p class="text-gray-600">
            If you change your mind, you can upgrade to Premium anytime from your profile page.
          </p>
        </div>
      </UCard>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton 
          to="/profile" 
          color="primary" 
          size="lg"
          icon="i-heroicons-user-circle"
        >
          Back to Profile
        </UButton>
        <UButton 
          to="/" 
          variant="outline" 
          size="lg"
          icon="i-heroicons-home"
        >
          Go Home
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
