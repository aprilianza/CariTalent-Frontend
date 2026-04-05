<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="space-y-3">
        <p class="text-sm font-medium text-neutral-light/70">Talent Workspace</p>
        <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">Profile</h1>
        <p class="text-sm text-neutral-light/80">Kelola informasi profil untuk meningkatkan peluang diterima organizer.</p>
      </div>
    </UiCard>

    <UiCard title="Basic Information" description="Data profil berdasarkan API talent profile.">
      <div v-if="pending" class="space-y-3">
        <USkeleton class="h-6 w-1/3 rounded-lg" />
        <USkeleton class="h-20 w-full rounded-xl" />
      </div>

      <div v-else class="space-y-5">
        <div>
          <p class="text-xs uppercase tracking-wide text-neutral-light/70">Stage Name</p>
          <p class="mt-1 text-lg font-semibold text-ui-light">{{ profile.stage_name }}</p>
        </div>

        <div>
          <p class="text-xs uppercase tracking-wide text-neutral-light/70">Genres</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <UiBadge v-for="genre in profile.genre" :key="genre" :label="genre" color="secondary" variant="soft" />
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Verification</p>
            <UiBadge class="mt-2" :label="profile.verified ? 'Verified' : 'Unverified'" :color="profile.verified ? 'success' : 'warning'" variant="soft" />
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Average Rating</p>
            <p class="mt-2 text-lg font-semibold text-ui-light">{{ profile.average_rating.toFixed(1) }} / 5</p>
          </div>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { useProfile } from '~/composables/useProfile';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Profile';

const { data: profile, pending } = useProfile();
</script>
