import { Navigate, useLocation } from "react-router-dom";
import authHelpers from "../helpers/authHelpers";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!authHelpers.isAuthenticated()) {
    // if not authenticated redirect to login: /
    return <Navigate to="/" state={location.pathname} replace />;
  } else {
    return children;
  }
};
