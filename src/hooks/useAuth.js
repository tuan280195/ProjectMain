import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.user ? "Logged In" : "Logged Out"));
  console.log("useAuth-----------")
  console.log(auth)
  console.log(useContext(AuthContext))
  return useContext(AuthContext);
};

export default useAuth;
