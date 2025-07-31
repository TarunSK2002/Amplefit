import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTrainerEnrollment from "./pages/admin/TrainerEnrollment";
import AdminCandidateEnrollment from "./pages/admin/CandidateEnrollment";
import AdminServices from "./pages/admin/Services";
import AdminAttendance from "./pages/admin/Attendance";
import AdminHealthProgress from "./pages/admin/HealthProgress";
import AdminPayment from "./pages/admin/Payment";
import AdminReport from "./pages/admin/Report";
import TrainerDashboard from "./pages/trainer/Dashboard";
import TrainerCandidateEnrollment from "./pages/trainer/CandidateEnrollment";
import TrainerAttendance from "./pages/trainer/Attendance";
import TrainerMyCandidates from "./pages/trainer/MyCandidates";
import TrainerHealthProgress from "./pages/trainer/HealthProgress";
import TrainerPayment from "./pages/trainer/Payment";
import TrainerReport from "./pages/trainer/Report";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import 'bootstrap/dist/css/bootstrap.min.css';
const queryClient = new QueryClient();

// useEffect(() => {
//   if (!localStorage.getItem("currentMode")) {
//     localStorage.setItem("currentMode", "attendance");
//   }
// }, []);


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/trainer-enrollment" element={
              <ProtectedRoute requiredRole="admin">
                <AdminTrainerEnrollment />
              </ProtectedRoute>
            } />
            <Route path="/admin/candidate-enrollment" element={
              <ProtectedRoute requiredRole="admin">
                <AdminCandidateEnrollment />
              </ProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <ProtectedRoute requiredRole="admin">
                <AdminServices />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance" element={
              <ProtectedRoute requiredRole="admin">
                <AdminAttendance />
              </ProtectedRoute>
            } />
            <Route path="/admin/health-progress" element={
              <ProtectedRoute requiredRole="admin">
                <AdminHealthProgress />
              </ProtectedRoute>
            } />
            <Route path="/admin/payment" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPayment />
              </ProtectedRoute>
            } />
            <Route path="/admin/report" element={
              <ProtectedRoute requiredRole="admin">
                <AdminReport />
              </ProtectedRoute>
            } />

            {/* Trainer Routes */}
            <Route path="/trainer/dashboard" element={
              <ProtectedRoute requiredRole="trainer">
                <TrainerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/trainer/candidate-enrollment" element={
              <ProtectedRoute requiredRole="trainer">
                <TrainerCandidateEnrollment />
              </ProtectedRoute>
            } />
            <Route path="/trainer/attendance" element={
              <ProtectedRoute requiredRole="trainer">
                <TrainerAttendance />
              </ProtectedRoute>
            } />
            <Route path="/trainer/my-candidates" element={
              <ProtectedRoute requiredRole="trainer">
                <TrainerMyCandidates />
              </ProtectedRoute>
            } />
            <Route path="/trainer/health-progress" element={
              <ProtectedRoute requiredRole="trainer">
                <TrainerHealthProgress />
              </ProtectedRoute>
            } />
            <Route path="/trainer/payment" element={
              <ProtectedRoute requiredRole="trainer">
                <TrainerPayment />
              </ProtectedRoute>
            } />
            <Route path="/trainer/report" element={
              <ProtectedRoute requiredRole="trainer">
                <TrainerReport />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
