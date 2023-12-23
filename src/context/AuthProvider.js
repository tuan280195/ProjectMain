import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  let currentAuthToken = localStorage.getItem("AuthToken") ?? {};
  console.log('currentAuthToken === typeof(string)11111111')
  if(typeof currentAuthToken === "string"){
    console.log('currentAuthToken === typeof(string)')
    currentAuthToken = JSON.parse(currentAuthToken)
  }
  const [auth, setAuth] = useState(currentAuthToken);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
