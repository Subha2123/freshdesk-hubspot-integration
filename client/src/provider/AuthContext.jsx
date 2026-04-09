import {  useState, useEffect , createContext } from "react";
import { getCurrentUser, logoutUser } from "../api/auth";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [externalConnections, setExternalConnections] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res=await getCurrentUser()
        if (res.user && res.connections) {
          setUser(res.user);
          setExternalConnections(res?.connections);
        } else {
          setUser(null);
          setExternalConnections(null)
        }
      } catch (err) {
        setUser(null);
        console.error("get user data",err)
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await logoutUser()
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, externalConnections, setExternalConnections, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

