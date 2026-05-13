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
      :invited-ids="invitedIds"
      @invite="handleInviteClick"
    />

    <!-- Invite Modal -->
    <UModal v-model:open="isInviteModalOpen" :ui="{ content: 'bg-transparent ring-0 shadow-none sm:max-w-md w-full mx-auto' }">
      <template #content>
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl">
          <div class="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 space-y-6">
            <div class="border-b border-white/5 pb-4">
              <h3 class="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Undang Talent
              </h3>
              <p class="mt-1.5 text-sm text-neutral-light/70">
                Tentukan harga penawaran (offering price) untuk talent ini.
              </p>
            </div>

            <form class="space-y-5" @submit.prevent="confirmInvite">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Harga Penawaran (Rp) <span class="text-error">*</span></label>
                <UInput
                  v-model="offeringPrice"
                  type="number"
                  placeholder="Contoh: 2000000"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                  required
                />
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-white/5">
                <UiButton color="neutral" variant="ghost" type="button" class="hover:bg-white/5" @click="isInviteModalOpen = false">Batal</UiButton>
                <UiButton
                  color="primary"
                  variant="soft"
                  type="submit"
                  :loading="invitingId !== null"
                  :disabled="!offeringPrice || Number(offeringPrice) <= 0"
                  icon="mdi:send-outline"
                  class="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-lg shadow-violet-500/25 border-0"
                >
                  Kirim Undangan
                </UiButton>
              </div>
            </form>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import EoRecommendationList from '~/components/eo/EoRecommendationList.vue';
import { useRecommendations } from '~/composables/useRecommendations';
import { useInvitations } from '~/composables/useInvitations';
import { useEoApplications } from '~/composables/useEoApplications';

definePageMeta({
  layout: 'eo',
});

const pageTitle = useState('eo-layout-title');
pageTitle.value = 'Rekomendasi Talent';

const route = useRoute();
const toast = useToast();

const eventId = computed(() => Number(route.params.id));
const { data: recommendations, pending } = useRecommendations(eventId.value);
const { inviteTalent } = useInvitations();
const { data: applications } = useEoApplications(eventId.value);

const invitingId = ref<number | null>(null);
const invitedIds = ref<number[]>([]);

watch(applications, (newApps) => {
  if (newApps && newApps.length > 0) {
    const ids = newApps.map((app) => app.talent.id);
    for (const id of ids) {
      if (!invitedIds.value.includes(id)) {
        invitedIds.value.push(id);
      }
    }
  }
}, { immediate: true });

const isInviteModalOpen = ref(false);
const selectedTalentIdForInvite = ref<number | null>(null);
const offeringPrice = ref<string>('');

const handleInviteClick = (talentId: number) => {
  if (invitedIds.value.includes(talentId)) {
    toast.add({
      title: 'Sudah diundang',
      description: 'Talent ini sudah pernah diundang sebelumnya.',
      color: 'warning',
    });
    return;
  }

  selectedTalentIdForInvite.value = talentId;
  offeringPrice.value = '';
  isInviteModalOpen.value = true;
};

const confirmInvite = async () => {
  if (selectedTalentIdForInvite.value === null) return;
  if (!offeringPrice.value || Number(offeringPrice.value) <= 0) return;

  const talentId = selectedTalentIdForInvite.value;
  invitingId.value = talentId;
  isInviteModalOpen.value = false;

  const talent = recommendations.value?.find((r) => r.talent.id === talentId)?.talent;
  
  const response = await inviteTalent(eventId.value, talentId, Number(offeringPrice.value));

  invitingId.value = null;
  selectedTalentIdForInvite.value = null;

  if (response.success) {
    invitedIds.value.push(talentId);
    toast.add({
      title: 'Undangan terkirim!',
      description: `${talent?.stage_name ?? 'Talent'} berhasil diundang ke event ini.`,
      color: 'success',
      icon: 'mdi:send-check-outline',
    });
  } else {
    toast.add({
      title: 'Gagal mengundang',
      description: response.message || 'Terjadi kesalahan sistem.',
      color: 'error',
    });
  }
};
</script>
