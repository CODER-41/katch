interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

// Stub component - Supabase removed
// TODO: Replace with real auth logic later
// Temporarily bypassed for development - allows direct access
const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  return <>{children}</>;
};

export default ProtectedAdminRoute;
