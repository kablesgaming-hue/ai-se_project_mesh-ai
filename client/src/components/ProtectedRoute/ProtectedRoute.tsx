import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const context = useOutletContext();
  const location = useLocation();

  if (isLoading) return null;
  return isAuthenticated ? <Outlet context={context} /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const requestedPath = location.state?.from?.pathname;
  const destination = requestedPath === "/chat" || requestedPath === "/knowledge"
    ? requestedPath
    : "/knowledge";

  if (isLoading) return null;
  return isAuthenticated ? <Navigate to={destination} replace /> : <Outlet />;
}
