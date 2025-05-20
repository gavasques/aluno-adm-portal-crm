
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import Layout from "./layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Suppliers from "./pages/student/Suppliers";
import Partners from "./pages/student/Partners";
import Tools from "./pages/student/Tools";
import MySuppliers from "./pages/student/MySuppliers";
import Settings from "./pages/student/Settings";
import AdminUsers from "./pages/admin/Users";
import AdminStudents from "./pages/admin/Students";
import AdminCourses from "./pages/admin/Courses";
import AdminMentoring from "./pages/admin/Mentoring";
import MentoringDetail from "./pages/admin/MentoringDetail";
import AdminBonus from "./pages/admin/Bonus";
import BonusDetail from "./pages/admin/BonusDetail";
import AdminTasks from "./pages/admin/Tasks";
import TaskDetail from "./pages/admin/TaskDetail";
import AdminCRM from "./pages/admin/CRM";
import AdminSuppliers from "./pages/admin/Suppliers";
import AdminPartners from "./pages/admin/Partners";
import AdminTools from "./pages/admin/Tools";
import CourseDetails from "./pages/admin/CourseDetails";
import StudentDetail from "./pages/admin/StudentDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              
              {/* Student Routes */}
              <Route path="student">
                <Route index element={<StudentDashboard />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="partners" element={<Partners />} />
                <Route path="tools" element={<Tools />} />
                <Route path="my-suppliers" element={<MySuppliers />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="admin">
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="gestao-alunos" element={<AdminStudents />} />
                <Route path="student/:id" element={<StudentDetail />} />
                <Route path="gestao-alunos/:id" element={<StudentDetail />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="courses/:id" element={<CourseDetails />} />
                <Route path="mentoring" element={<AdminMentoring />} />
                <Route path="mentoring/:id" element={<MentoringDetail />} />
                <Route path="bonus" element={<AdminBonus />} />
                <Route path="bonus/:id" element={<BonusDetail />} />
                <Route path="tasks" element={<AdminTasks />} />
                <Route path="tasks/:id" element={<TaskDetail />} />
                <Route path="crm" element={<AdminCRM />} />
                <Route path="suppliers" element={<AdminSuppliers />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="tools" element={<AdminTools />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
