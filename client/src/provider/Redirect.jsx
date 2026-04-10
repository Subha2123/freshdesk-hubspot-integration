import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";

const RootRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div><PageLoader /></div>;

  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default RootRedirect;