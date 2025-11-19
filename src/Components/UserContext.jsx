import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load from localStorage on refresh
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // ✅ Save login data (userId + userType)
  const loginUser = ({ userId, userType, name, userName, role}) => {
    const data = { userId, userType, name, userName, role };
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    console.log("LOGIN USER CALLED WITH =", { userId, userType, name, userName, role });

  };
  



  // ✅ Logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
