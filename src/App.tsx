
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { OptimizedRouteGuard } from "@/components/OptimizedRouteGuard";
import { Loader2 } from "lucide-react";
import "./App.css";

// Lazy load components
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

// Admin lazy imports
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminStudents = lazy(() => import("@/pages/admin/AdminStudents"));
const AdminSuppliers = lazy(() => import("@/pages/admin/AdminSuppliers"));
const AdminPartners = lazy(() => import("@/pages/admin/AdminPartners"));
const AdminTools = lazy(() => import("@/pages/admin/AdminTools"));
const AdminCourses = lazy(() => import("@/pages/admin/AdminCourses"));
const AdminMentoring = lazy(() => import("@/pages/admin/AdminMentoring"));
const AdminBonus = lazy(() => import("@/pages/admin/AdminBonus"));
const AdminCRM = lazy(() => import("@/pages/admin/AdminCRM"));
const AdminTasks = lazy(() => import("@/pages/admin/AdminTasks"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminCredits = lazy(() => import("@/pages/admin/AdminCredits"));

// Mentoring lazy imports
const AdminMentoringDashboard = lazy(() => import("@/pages/admin/AdminMentoringDashboard"));
const AdminMentoringCatalog = lazy(() => import("@/pages/admin/AdminMentoringCatalog"));
const AdminMentoringIndividual = lazy(() => import("@/pages/admin/AdminMentoringIndividual"));
const AdminMentoringGroup = lazy(() => import("@/pages/admin/AdminMentoringGroup"));
const AdminMentoringSessionsIndividual = lazy(() => import("@/pages/admin/AdminMentoringSessionsIndividual"));
const AdminMentoringSessionsGroup = lazy(() => import("@/pages/admin/AdminMentoringSessionsGroup"));
const AdminMentoringMaterials = lazy(() => import("@/pages/admin/AdminMentoringMaterials"));

// Student lazy imports
const StudentDashboard = lazy(() => import("@/pages/student/StudentDashboard"));
const StudentSuppliers = lazy(() => import("@/pages/student/StudentSuppliers"));
const StudentPartners = lazy(() => import("@/pages/student/StudentPartners"));
const StudentTools = lazy(() => import("@/pages/student/StudentTools"));
const StudentMySuppliers = lazy(() => import("@/pages/student/StudentMySuppliers"));
const StudentSettings = lazy(() => import("@/pages/student/StudentSettings"));

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
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminDashboard />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/usuarios" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminUsers />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/alunos" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminStudents />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/fornecedores" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminSuppliers />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/parceiros" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminPartners />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/ferramentas" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminTools />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/cursos" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminCourses />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoria" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminMentoring />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/bonus" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminBonus />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/crm" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminCRM />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/tarefas" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminTasks />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/configuracoes" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminSettings />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/creditos" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminCredits />
                          </OptimizedRouteGuard>
                        } 
                      />

                      {/* Mentoring routes */}
                      <Route 
                        path="/admin/mentoring-dashboard" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminMentoringDashboard />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-catalog" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminMentoringCatalog />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-individual" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminMentoringIndividual />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-group" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminMentoringGroup />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-sessions-individual" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminMentoringSessionsIndividual />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-sessions-group" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
                            <AdminMentoringSessionsGroup />
                          </OptimizedRouteGuard>
                        } 
                      />
                      <Route 
                        path="/admin/mentoring-materials" 
                        element={
                          <OptimizedRouteGuard requiredRole="admin">
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
