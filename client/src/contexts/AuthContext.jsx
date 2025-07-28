// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email, password, role) => {
//   setIsLoading(true);

//   try {
//     // First, call the main login API
//     const res = await fetch("https://localhost:7081/Bio/Login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userName: email,
//         password,
//         role,
//       }),
//     });

//     if (!res.ok) throw new Error("Login failed");

//     const data = await res.json();

//     const userData = {
//       userName: email,
//       role: role,
//       ...data, // In case your API returns additional fields
//     };

//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));

//     // ✅ Call the trainer notification API if role is 'trainer'
//     if (role === "trainer") {
//       await fetch(
//         `https://localhost:7081/Bio/AuthenticateTrainerLogin?username=${email}&password=${password}`,
//         {
//           method: "POST",
//         }
//       );
//     }

//     return true;
//   } catch (error) {
//     console.error("Login error:", error);
//     return false;
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };






































import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, role) => {
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:7081/Bio/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: email,
          password,
          role,
        }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      const userData = {
        userName: email,
        role,
        ...data,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      if (role === "trainer") {
        await fetch(
          `http://localhost:7081/Bio/AuthenticateTrainerLogin?username=${email}&password=${password}`,
          { method: "POST" }
        );
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
