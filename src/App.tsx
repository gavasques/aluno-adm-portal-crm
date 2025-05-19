
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Courses from "./pages/admin/Courses";
import CourseDetails from "./pages/admin/CourseDetails";
import Mentoring from "./pages/admin/Mentoring";
import MentoringDetail from "./pages/admin/MentoringDetail";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import Suppliers from "./pages/admin/Suppliers";
import Partners from "./pages/admin/Partners";
import Tools from "./pages/admin/Tools";
import Tasks from "./pages/admin/Tasks";
import TaskDetail from "./pages/admin/TaskDetail";
import Bonus from "./pages/admin/Bonus";
import CRM from "./pages/admin/CRM";
import LeadDetail from "./pages/admin/LeadDetail";
import StudentDashboard from "./pages/student/Dashboard";
import StudentSuppliers from "./pages/student/Suppliers";
import StudentPartners from "./pages/student/Partners";
import StudentTools from "./pages/student/Tools";
import StudentMySuppliers from "./pages/student/MySuppliers";
import StudentSettings from "./pages/student/Settings";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/courses" element={<Courses />} />
          <Route path="admin/courses/:id" element={<CourseDetails />} />
          <Route path="admin/mentoring" element={<Mentoring />} />
          <Route path="admin/mentoring/:id" element={<MentoringDetail />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/students" element={<Students />} />
          <Route path="admin/suppliers" element={<Suppliers />} />
          <Route path="admin/partners" element={<Partners />} />
          <Route path="admin/tools" element={<Tools />} />
          <Route path="admin/tasks" element={<Tasks />} />
          <Route path="admin/tasks/:id" element={<TaskDetail />} />
          <Route path="admin/bonus" element={<Bonus />} />
          <Route path="admin/crm" element={<CRM />} />
          <Route path="admin/crm/lead/:id" element={<LeadDetail />} />
          
          {/* Student Routes */}
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/suppliers" element={<StudentSuppliers />} />
          <Route path="student/partners" element={<StudentPartners />} />
          <Route path="student/tools" element={<StudentTools />} />
          <Route path="student/my-suppliers" element={<StudentMySuppliers />} />
          <Route path="student/settings" element={<StudentSettings />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
