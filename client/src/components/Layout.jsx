// import React from 'react';
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "./AppSidebar";

// const Layout = ({ children }) => {
//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full bg-gray-50">
//         <AppSidebar />
//         <main className="flex-1 p-6">
//           {children}
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Layout;







import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="h-60 flex flex-col w-full h-50 bg-gray-50">
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 px-4">
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t text-center py-3 text-sm text-gray-600">
          &copy; 2025 <strong>AmpLeFit</strong>. Designed by{" "}
          <a
            href="http://misoftwaresolutionsllp.com/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Misoftware Solutions
          </a>
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
