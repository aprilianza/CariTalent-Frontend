import type { AdminUser, AdminUsersData, ApiResponse } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const usersPayload: ApiResponse<AdminUsersData> = {
  success: true,
  message: 'OK',
  data: {
    users: [
      {
        id: 1,
        name: 'Budi Santoso',
        email: 'budi@email.com',
        role: 'talent',
        phone: '081234567890',
        created_at: '2026-03-08T10:00:00Z',
      },
      {
        id: 2,
        name: 'Kafe Kota',
        email: 'kafe@kota.id',
        role: 'eo',
        phone: '082111222333',
        created_at: '2026-03-09T08:30:00Z',
      },
      {
        id: 3,
        name: 'Riot Kids',
        email: 'riot@kids.band',
        role: 'talent',
        phone: '085677889900',
        created_at: '2026-03-10T15:00:00Z',
      },
      {
        id: 4,
        name: 'Jakarta Music Hall',
        email: 'hello@jmusichall.id',
        role: 'eo',
        phone: '021-555-9999',
        created_at: '2026-03-11T11:20:00Z',
      },
      {
        id: 5,
        name: 'Ayu Pratiwi',
        email: 'ayu@singer.id',
        role: 'talent',
        phone: '089876543210',
        created_at: '2026-03-12T09:00:00Z',
      },
      {
        id: 6,
        name: 'Bandung Creative Space',
        email: 'halo@bcs.id',
        role: 'eo',
        phone: '022-444-8888',
        created_at: '2026-03-13T14:00:00Z',
      },
      {
        id: 7,
        name: 'Dimas Akustik',
        email: 'dimas@akustik.id',
        role: 'talent',
        phone: '081398765432',
        created_at: '2026-03-15T10:00:00Z',
      },
      {
        id: 8,
        name: 'Rooftop Echo',
        email: 'rooftop@echo.id',
        role: 'eo',
        phone: '021-777-2345',
        created_at: '2026-03-16T09:00:00Z',
      },
    ],
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 8,
      last_page: 1,
    },
  },
};

export const useAdminUsers = () => {
  const resource = useMockResource<AdminUsersData>('admin-users', usersPayload);
  const users = ref<AdminUser[]>([]);

  watch(
    resource.data,
    (value) => {
      users.value = value.users.map((u) => ({ ...u }));
    },
    { immediate: true },
  );

  const deleteUser = (id: number) => {
    users.value = users.value.filter((u) => u.id !== id);
  };

  return {
    ...resource,
    users,
    deleteUser,
    pagination: computed(() => resource.data.value.pagination),
  };
};
