export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth_token');
  const { user, fetchMe } = useAuth();

  const isAuthRoute = to.path.startsWith('/auth/login') || to.path.startsWith('/auth/register');
  const isDashboardRoute = to.path.startsWith('/dashboard');

  if (isDashboardRoute && !token.value) {
    return navigateTo('/auth/login');
  }

  if (token.value && !user.value) {
    await fetchMe();
  }

  if (isAuthRoute && token.value && user.value) {
    if (user.value.role === 'admin') return navigateTo('/dashboard/admin/users');
    return navigateTo(`/dashboard/${user.value.role}`);
  }
});
