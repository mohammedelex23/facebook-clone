import { Navigate } from "react-router-dom";
import authHelpers from "../helpers/authHelpers";

export const ProtectedAuth = ({ children }) => {
  if (authHelpers.isAuthenticated()) {
    // if authenticated redirect to home
    return <Navigate to="/home" replace />;
  } else {
    return children;
  }
};
