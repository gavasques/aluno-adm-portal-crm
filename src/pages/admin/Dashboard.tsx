
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { CRMOverview } from "@/components/admin/dashboard/CRMOverview";
import { RecentStudents } from "@/components/admin/dashboard/RecentStudents";
import { UpcomingMentoring } from "@/components/admin/dashboard/UpcomingMentoring";
import { UpcomingTasks } from "@/components/admin/dashboard/UpcomingTasks";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <DashboardHeader />
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CRMOverview />
        <RecentStudents />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingMentoring />
        <UpcomingTasks />
      </div>
    </div>
  );
};

export default AdminDashboard;
