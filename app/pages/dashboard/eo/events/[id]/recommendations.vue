<template>
  <div class="space-y-6">
    <!-- Header -->
    <UiCard card-class="border-white/10 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
      <div class="space-y-4">
        <UiButton
          size="sm"
          color="neutral"
          variant="ghost"
          icon="mdi:arrow-left"
          @click="navigateTo('/dashboard/eo/events')"
        >
          Kembali ke Events
        </UiButton>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Rekomendasi Talent
            </h1>
            <p class="mt-1 text-sm text-neutral-light/70">
              Top 5 talent paling cocok untuk event ini · Matchmaking berbasis genre, budget, dan lokasi
            </p>
          </div>

          <UiButton
            icon="mdi:account-multiple-outline"
            color="secondary"
            variant="soft"
            @click="navigateTo(`/dashboard/eo/events/${route.params.id}/applicants`)"
          >
            Lihat Pelamar
          </UiButton>
        </div>
      </div>
    </UiCard>

    <!-- Score legend -->
    <UiCard card-class="border-white/10">
      <div class="flex flex-wrap gap-4 text-xs text-neutral-light/70">
        <div class="flex items-center gap-1.5">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-violet-400" />
          Genre Match: +50 poin
        </div>
        <div class="flex items-center gap-1.5">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
          Budget Match: +30 poin
        </div>
        <div class="flex items-center gap-1.5">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-indigo-400" />
          Lokasi Match (&#x3C;20km): +20 poin
        </div>
      </div>
    </UiCard>

    <!-- Recommendation list -->
    <EoRecommendationList
      :recommendations="recommendations"
      :loading="pending"
      :inviting-id="invitingId"
      @invite="handleInvite"
    />
  </div>
</template>

<script setup lang="ts">
import EoRecommendationList from '~/components/eo/EoRecommendationList.vue';
import { useRecommendations } from '~/composables/useRecommendations';

definePageMeta({
  layout: 'eo',
});

const pageTitle = useState('eo-layout-title');
pageTitle.value = 'Rekomendasi Talent';

const route = useRoute();
const toast = useToast();

const eventId = computed(() => Number(route.params.id));
const { data: recommendations, pending } = useRecommendations(eventId.value);

const invitingId = ref<number | null>(null);
const invitedIds = ref<number[]>([]);

const handleInvite = async (talentId: number) => {
  if (invitedIds.value.includes(talentId)) {
    toast.add({
      title: 'Sudah diundang',
      description: 'Talent ini sudah pernah diundang sebelumnya.',
      color: 'warning',
    });
    return;
  }

  invitingId.value = talentId;

  // Simulate API: POST /invitations
  await new Promise((resolve) => setTimeout(resolve, 700));

  invitedIds.value.push(talentId);
  invitingId.value = null;

  const talent = recommendations.value.find((r) => r.talent.id === talentId)?.talent;

  toast.add({
    title: 'Undangan terkirim!',
    description: `${talent?.stage_name ?? 'Talent'} berhasil diundang ke event ini.`,
    color: 'success',
    icon: 'mdi:send-check-outline',
  });
};
</script>
