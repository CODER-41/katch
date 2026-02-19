import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

// Stub component - Supabase removed
// TODO: Replace with real auth logic later
// For now, always redirects to /admin/login
const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Always redirect to login since we have no auth
    navigate("/admin/login");
  }, [navigate]);

  return null;
};

export default ProtectedAdminRoute;
