<template>
  <UiCard title="Recommended Events" description="Event yang cocok berdasarkan genre kamu">
    <UiList :items="recommendations" empty-text="Belum ada rekomendasi baru.">
      <template #item="{ item }">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ item.subtitle }}</p>
          </div>
          <UiButton size="sm" variant="soft" color="primary">Lihat</UiButton>
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
const recommendations = [
  {
    id: 'rec-1',
    title: 'Alternative Friday Session',
    subtitle: 'Bandung Creative Space • Budget 2.5jt',
  },
  {
    id: 'rec-2',
    title: 'Indie Summer Showcase',
    subtitle: 'Jakarta Music Hall • Budget 3jt',
  },
];
</script>
