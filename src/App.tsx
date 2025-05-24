
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import AdminLayout from "@/layout/AdminLayout";
import StudentLayout from "@/layout/StudentLayout";

// Public pages
import Index from "@/pages/Index";
import ResetPassword from "@/pages/ResetPassword";
import AcceptInvite from "@/pages/AcceptInvite";
import NotFound from "@/pages/NotFound";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminStudents from "@/pages/admin/Students";
import AdminSuppliers from "@/pages/admin/Suppliers";
import AdminPartners from "@/pages/admin/Partners";
import AdminTools from "@/pages/admin/Tools";
import AdminTasks from "@/pages/admin/Tasks";
import AdminCRM from "@/pages/admin/CRM";
import AdminAudit from "@/pages/admin/Audit";
import AdminSettings from "@/pages/admin/Settings";
import AdminPermissions from "@/pages/admin/Permissions";
import AdminBonuses from "@/pages/admin/Bonus";
import AdminBonusDetail from "@/pages/admin/BonusDetail";
import AdminCourses from "@/pages/admin/Courses";
import AdminCourseDetails from "@/pages/admin/CourseDetails";
import AdminRegisters from "@/pages/admin/Registers";
import AdminMentoringDetail from "@/pages/admin/MentoringDetail";
import AdminTaskDetail from "@/pages/admin/TaskDetail";
import AdminStudentDetail from "@/pages/admin/StudentDetail";

// New mentoring pages
import AdminMentoringCatalog from "@/pages/admin/MentoringCatalog";
import AdminGroupMentoring from "@/pages/admin/GroupMentoring";
import AdminIndividualMentoring from "@/pages/admin/IndividualMentoring";
import AdminMentoringMaterials from "@/pages/admin/MentoringMaterials";

// Student pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentSuppliers from "@/pages/student/Suppliers";
import StudentMySuppliers from "@/pages/student/MySuppliers";
import StudentPartners from "@/pages/student/Partners";
import StudentTools from "@/pages/student/Tools";
import StudentSettings from "@/pages/student/Settings";
import StudentMyMentoring from "@/pages/student/MyMentoring";

// Route Guards
import AdminRouteGuard from "@/components/admin/RouteGuard";
import StudentRouteGuard from "@/components/student/RouteGuard";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/accept-invite" element={<AcceptInvite />} />

              {/* Admin routes */}
              <Route path="/admin/*" element={
                <AdminRouteGuard>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/users" element={<AdminUsers />} />
                      <Route path="/students" element={<AdminStudents />} />
                      <Route path="/students/:id" element={<AdminStudentDetail />} />
                      <Route path="/suppliers" element={<AdminSuppliers />} />
                      <Route path="/partners" element={<AdminPartners />} />
                      <Route path="/tools" element={<AdminTools />} />
                      <Route path="/tasks" element={<AdminTasks />} />
                      <Route path="/tasks/:id" element={<AdminTaskDetail />} />
                      <Route path="/crm" element={<AdminCRM />} />
                      <Route path="/audit" element={<AdminAudit />} />
                      <Route path="/settings" element={<AdminSettings />} />
                      <Route path="/permissions" element={<AdminPermissions />} />
                      <Route path="/bonus" element={<AdminBonuses />} />
                      <Route path="/bonus/:id" element={<AdminBonusDetail />} />
                      <Route path="/courses" element={<AdminCourses />} />
                      <Route path="/courses/:id" element={<AdminCourseDetails />} />
                      <Route path="/cadastros" element={<AdminRegisters />} />
                      <Route path="/mentorias/:id" element={<AdminMentoringDetail />} />
                      
                      {/* New mentoring routes */}
                      <Route path="/mentoring-catalog" element={<AdminMentoringCatalog />} />
                      <Route path="/group-mentoring/:id" element={<AdminGroupMentoring />} />
                      <Route path="/individual-mentoring" element={<AdminIndividualMentoring />} />
                      <Route path="/mentoring-materials" element={<AdminMentoringMaterials />} />
                    </Routes>
                  </AdminLayout>
                </AdminRouteGuard>
              } />

              {/* Student routes */}
              <Route path="/student/*" element={
                <StudentRouteGuard requiredMenuKey="student">
                  <StudentLayout>
                    <Routes>
                      <Route path="/" element={<StudentDashboard />} />
                      <Route path="/suppliers" element={<StudentSuppliers />} />
                      <Route path="/my-suppliers" element={<StudentMySuppliers />} />
                      <Route path="/partners" element={<StudentPartners />} />
                      <Route path="/tools" element={<StudentTools />} />
                      <Route path="/settings" element={<StudentSettings />} />
                      <Route path="/my-mentoring" element={<StudentMyMentoring />} />
                    </Routes>
                  </StudentLayout>
                </StudentRouteGuard>
              } />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
