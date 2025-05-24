
import { DashboardHeader } from "@/components/student/dashboard/DashboardHeader";
import { ResourceCards } from "@/components/student/dashboard/ResourceCards";
import { GeneralResources } from "@/components/student/dashboard/GeneralResources";
import { MyArea } from "@/components/student/dashboard/MyArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentDashboard = () => {
  return (
    <div className="w-full">
      <DashboardHeader />
      <ResourceCards />
      
      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="myarea">Minha Área</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <GeneralResources />
        </TabsContent>
        
        <TabsContent value="myarea" className="space-y-6">
          <MyArea />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
