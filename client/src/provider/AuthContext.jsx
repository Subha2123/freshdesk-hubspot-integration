import {  useState, useEffect , createContext } from "react";
import { getCurrentUser } from "../api/auth";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [externalConnections, setExternalConnections] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
  setLoading(true);
  try {
    const res = await getCurrentUser();
    if (res.user && res.connections) {
      setUser(res.user);
      setExternalConnections(res.connections);
    } else {
      setUser(null);
      setExternalConnections(null);
    }
  } catch (err) {
    setUser(null);
    setExternalConnections(null);
    console.error("get user data", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    localStorage.removeItem('token')
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, externalConnections, setExternalConnections, loading , refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

