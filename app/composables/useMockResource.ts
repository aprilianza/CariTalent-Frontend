import type { ApiResponse } from '~/composables/types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApiRequest = async <T>(payload: ApiResponse<T>, delay = 240): Promise<ApiResponse<T>> => {
  await wait(delay);
  return payload;
};

export const useMockResource = <T>(key: string, payload: ApiResponse<T>, delay?: number) => {
  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData<ApiResponse<T>>(key, () => mockApiRequest(payload, delay), {
    default: () => payload,
  });

  const data = computed<T>(() => response.value?.data ?? payload.data);
  const message = computed(() => response.value?.message ?? payload.message);
  const success = computed(() => response.value?.success ?? payload.success);

  return {
    response,
    data,
    message,
    success,
    pending,
    error,
    refresh,
  };
};
