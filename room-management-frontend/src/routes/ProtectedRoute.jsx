import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { path_name } from "../constants/path_name";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={path_name.login} replace />;
};

export default ProtectedRoute;
