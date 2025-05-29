
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { AuthProvider } from "@/hooks/useAuth";
import RouteGuard from "@/components/RouteGuard";
import OptimizedRouteGuard from "@/components/OptimizedRouteGuard";
import { Loader2 } from "lucide-react";
import "./App.css";

// Lazy load components - usando os caminhos corretos que existem
const Home = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/student/Dashboard"));

// Admin lazy imports - usando os caminhos corretos que existem
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminStudents = lazy(() => import("@/pages/admin/Registers"));
const AdminSuppliers = lazy(() => import("@/pages/admin/Suppliers"));
const AdminPartners = lazy(() => import("@/pages/admin/Partners"));
const AdminTools = lazy(() => import("@/pages/admin/Tools"));
const AdminCourses = lazy(() => import("@/pages/admin/Courses"));
const AdminMentoring = lazy(() => import("@/pages/admin/Mentoring"));
const AdminBonus = lazy(() => import("@/pages/admin/Bonus"));
const AdminCRM = lazy(() => import("@/pages/admin/CRM"));
const AdminTasks = lazy(() => import("@/pages/admin/Tasks"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminCredits = lazy(() => import("@/pages/admin/Credits"));

// Mentoring lazy imports
const AdminMentoringDashboard = lazy(() => import("@/pages/admin/AdminMentoringDashboard"));
const AdminMentoringCatalog = lazy(() => import("@/pages/admin/AdminMentoringCatalog"));
const AdminMentoringIndividual = lazy(() => import("@/pages/admin/AdminMentoringIndividual"));
const AdminMentoringGroup = lazy(() => import("@/pages/admin/AdminMentoringGroup"));
const AdminMentoringSessionsIndividual = lazy(() => import("@/pages/admin/AdminMentoringSessionsIndividual"));
const AdminMentoringSessionsGroup = lazy(() => import("@/pages/admin/AdminMentoringSessionsGroup"));
const AdminMentoringMaterials = lazy(() => import("@/pages/admin/AdminMentoringMaterials"));

// Student lazy imports - usando os caminhos corretos que existem
const StudentDashboard = lazy(() => import("@/pages/student/Dashboard"));
const StudentSuppliers = lazy(() => import("@/pages/student/Suppliers"));
const StudentPartners = lazy(() => import("@/pages/student/Partners"));
const StudentTools = lazy(() => import("@/pages/student/Tools"));
const StudentMySuppliers = lazy(() => import("@/pages/student/MySuppliers"));
const StudentSettings = lazy(() => import("@/pages/student/Settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AccessibilityProvider>
          <TooltipProvider>
            <Router>
              <AuthProvider>
                <SkipToContent />
                <div className="min-h-screen bg-background">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />

                      {/* Protected routes */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <RouteGuard>
                            <Dashboard />
                          </RouteGuard>
                        } 
                      />

                      {/* Admin routes */}
                      <Route 
                        path="/admin/dashboard" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminDashboard />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/usuarios" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminUsers />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/alunos" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminStudents />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/fornecedores" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminSuppliers />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/parceiros" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminPartners />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/ferramentas" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminTools />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/cursos" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminCourses />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoria" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminMentoring />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/bonus" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminBonus />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/crm" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminCRM />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/tarefas" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminTasks />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/configuracoes" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminSettings />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/creditos" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminCredits />
                          </OptimizedRouteGuard>
                        } 
                      />

                      {/* Mentoring routes */}
                      <Route 
                        path="/admin/mentoring-dashboard" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminMentoringDashboard />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-catalog" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminMentoringCatalog />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-individual" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminMentoringIndividual />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-group" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminMentoringGroup />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-sessions-individual" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminMentoringSessionsIndividual />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-sessions-group" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminMentoringSessionsGroup />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-materials" 
                        element={
                          <OptimizedRouteGuard requireAdminAccess={true}>
                            <AdminMentoringMaterials />
                          </OptimizedRouteGuard>
                        } 
                      />

                      {/* Student routes */}
                      <Route 
                        path="/student/dashboard" 
                        element={
                          <RouteGuard>
                            <StudentDashboard />
                          </RouteGuard>
                        } 
                      />
                      <Route 
                        path="/student/fornecedores" 
                        element={
                          <RouteGuard>
                            <StudentSuppliers />
                          </RouteGuard>
                        } 
                      />
                      <Route 
                        path="/student/parceiros" 
                        element={
                          <RouteGuard>
                            <StudentPartners />
                          </RouteGuard>
                        } 
                      />
                      <Route 
                        path="/student/ferramentas" 
                        element={
                          <RouteGuard>
                            <StudentTools />
                          </RouteGuard>
                        } 
                      />
                      <Route 
                        path="/student/meus-fornecedores" 
                        element={
                          <RouteGuard>
                            <StudentMySuppliers />
                          </RouteGuard>
                        } 
                      />
                      <Route 
                        path="/student/configuracoes" 
                        element={
                          <RouteGuard>
                            <StudentSettings />
                          </RouteGuard>
                        } 
                      />

                      {/* Catch all route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </div>
                <Toaster />
                <Sonner />
              </AuthProvider>
            </Router>
          </TooltipProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
