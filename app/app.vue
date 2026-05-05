<template>
  <UApp :toaster="{ position: 'top-center', ui: { base: 'backdrop-blur-xl bg-[#1e1e2e]/90 border border-white/10 shadow-2xl rounded-2xl ring-0 mt-4', title: 'font-bold text-ui-light', description: 'text-neutral-light/80' } }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
