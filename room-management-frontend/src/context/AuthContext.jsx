// import React, { createContext, useContext, useEffect, useState } from "react";
// import jwtDecode from "jwt-decode";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("access_token"));
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (token) {
//       const decoded = jwtDecode(token);
//       setUser({
//         id: decoded.userId,
//         username: decoded.sub,
//         role: decoded.role, // ADMIN | STAFF
//       });
//     } else {
//       setUser(null);
//     }
//   }, [token]);

//   const login = (accessToken, refreshToken) => {
//     localStorage.setItem("access_token", accessToken);
//     localStorage.setItem("refresh_token", refreshToken);
//     setToken(accessToken);
//   };

//   const logout = () => {
//     localStorage.clear();
//     setToken(null);
//     setUser(null);
//   };

//   const isAuthenticated = !!token;

//   return (
//     <AuthContext.Provider
//       value={{ user, token, login, logout, isAuthenticated }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
