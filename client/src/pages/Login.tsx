// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useToast } from "../hooks/use-toast";
// import Logo from "../../public/amplefit gym_Logo.jpg";

// const Login = () => {
//   const [userName, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("admin");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:7081/Bio/Login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userName, password, role }),
//       });

//       if (!response.ok) {
//         throw new Error("Invalid credentials");
//       }

//       const data = await response.json();

//       // Save user to localStorage or context if needed
//       localStorage.setItem("user", JSON.stringify(data));

//       toast({
//         title: "Login successful",
//         description: `Welcome, ${data.role}!`,
//       });

//       // Redirect after login
//       if (data.role === "admin") {
//         navigate("/admin/dashboard");
//       } else if (data.role === "trainer") {
//         navigate("/trainer/dashboard");
//       }
//     } catch (err) {
//       toast({
//         title: "Login failed",
//         description: err.message || "Server error",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <Card className="shadow-lg border-0">
//           <CardHeader className="space-y-1 pb-6">
//             <div className="text-center mb-8">
//               <div className="p-2 h-16 mx-auto mb-4">
//                 <img src={Logo} alt="Logo" />
//               </div>
//               <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                 AMPLEFIT GYM
//               </h1>
//               <p className="text-gray-600">
//                 Professional Training Management System
//               </p>
//             </div>
//             <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
//             <CardDescription className="text-center">
//               Select role and enter your credentials
//             </CardDescription>
//           </CardHeader>

//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <Label className="flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     value="admin"
//                     checked={role === "admin"}
//                     onChange={() => setRole("admin")}
//                   />
//                   <span>Admin</span>
//                 </Label>
//                 <Label className="flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     value="trainer"
//                     checked={role === "trainer"}
//                     onChange={() => setRole("trainer")}
//                   />
//                   <span>Trainer</span>
//                 </Label>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="username">Username</Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="Enter your username"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                   className="h-11"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="h-11"
//                 />
//               </div>
//             </CardContent>

//             <CardFooter>
//               <Button
//                 type="submit"
//                 className="w-full h-11 bg-blue-600 hover:bg-blue-700"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>
//             </CardFooter>
//           </form>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Login;
























import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../contexts/AuthContext"; // ✅ import useAuth
import Logo from "../../public/amplefit gym_Logo.jpg";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth(); // ✅ use login from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(userName, password, role); // ✅ context login

      if (!success) {
        throw new Error("Invalid credentials");
      }

      toast({
        title: "Login successful",
        description: `Welcome, ${role}!`,
      });

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "trainer") {
        navigate("/trainer/dashboard");
      }
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.message || "Server error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="text-center mb-8">
              <div className="p-2 h-16 mx-auto mb-4">
                <img src={Logo} alt="Logo" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                AMPLEFIT GYM
              </h1>
              <p className="text-gray-600">
                Professional Training Management System
              </p>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Select role and enter your credentials
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="admin"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                  />
                  <span>Admin</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="trainer"
                    checked={role === "trainer"}
                    onChange={() => setRole("trainer")}
                  />
                  <span>Trainer</span>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
