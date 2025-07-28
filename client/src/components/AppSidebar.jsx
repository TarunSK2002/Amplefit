import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Settings,
  Calendar,
  Heart,
  CreditCard,
  FileText,
  LogOut,
  Dumbbell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../../public/amplefit_gym_v001.png"
export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Trainer Enrollment",
      url: "/admin/trainer-enrollment",
      icon: UserPlus,
    },
    {
      title: "Candidate Enrollment",
      url: "/admin/candidate-enrollment",
      icon: Users,
    },
    {
      title: "Master",
      url: "/admin/services",
      icon: Settings,
    },
    {
      title: "Attendance",
      url: "/admin/attendance",
      icon: Calendar,
    },
    // {
    //   title: "Health Progress",
    //   url: "/admin/health-progress",
    //   icon: Heart,
    // },
    {
      title: "Payment",
      url: "/admin/payment",
      icon: CreditCard,
    },
    {
      title: "Reports",
      url: "/admin/report",
      icon: FileText,
    },
  ];

  const trainerMenuItems = [
    {
      title: "Dashboard",
      url: "/trainer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Candidate Enrollment",
      url: "/trainer/candidate-enrollment",
      icon: Users,
    },
    {
      title: "Attendance",
      url: "/trainer/attendance",
      icon: Calendar,
    },
    // {
    //   title: "My Candidates",
    //   url: "/trainer/my-candidates",
    //   icon: Users,
    // },
    // {
    //   title: "Health & Progress",
    //   url: "/trainer/health-progress",
    //   icon: Heart,
    // },
    {
      title: "Payment",
      url: "/trainer/payment",
      icon: CreditCard,
    },
    {
      title: "Reports",
      url: "/trainer/report",
      icon: FileText,
    },
  ];

  const menuItems =
    user && user.role === "admin" ? adminMenuItems : trainerMenuItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200 mt-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AMPLEFIT GYM</h2>
            <p className="text-l text-gray-500 capitalize">
              {user?.role} Panel
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
             Navigation 
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full justify-start h-10 px-3 rounded-lg transition-colors ${
                      location.pathname === item.url
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <button onClick={() => navigate(item.url)}>
                      <item.icon className="h-4 w-4 mr-3" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-100 p-2 rounded-full">
            <Users className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || user?.userName}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role}
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full justify-start h-9 text-gray-700 hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
