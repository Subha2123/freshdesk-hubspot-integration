import { useContext  } from "react";
import { AuthContext } from "../provider/AuthContext";



export const useAuth = () => useContext(AuthContext);
