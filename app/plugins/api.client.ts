export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const token = useCookie('auth_token');

  const $api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
          Accept: 'application/json',
        };
      } else {
        options.headers = {
          ...options.headers,
          Accept: 'application/json',
        };
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // Clear token and redirect to login if unauthorized
        token.value = null;
        if (process.client) {
          navigateTo('/auth/login');
        }
      }
    },
  });

  return {
    provide: {
      api: $api,
    },
  };
});
