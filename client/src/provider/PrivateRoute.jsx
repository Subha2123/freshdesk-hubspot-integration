import { Navigate } from "react-router-dom";
import { useAuth } from "../customHooks/useAuth";
import PageLoader from "../components/PageLoader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div><PageLoader /></div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
