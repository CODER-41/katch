// Stub hook - Supabase removed
// TODO: Replace with real auth logic later
// Temporarily returns mock user for development
export const useAuth = () => {
  return {
    user: { email: "admin@kakamegaschool.ac.ke" },
    session: { user: { email: "admin@kakamegaschool.ac.ke" } },
    loading: false,
  };
};
