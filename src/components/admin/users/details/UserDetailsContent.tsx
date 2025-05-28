
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBasicInfo from "./UserBasicInfo";
import UserStatusInfo from "./UserStatusInfo";

interface UserDetailsContentProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    storage_used_mb?: number;
    storage_limit_mb?: number;
    tasks?: any[];
    is_mentor?: boolean;
  };
  onRefresh?: () => void;
}

const UserDetailsContent: React.FC<UserDetailsContentProps> = ({ user, onRefresh }) => {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Informações</TabsTrigger>
        <TabsTrigger value="activity">Atividade</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserBasicInfo user={user} />
          <UserStatusInfo user={user} />
        </div>
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-6">
        <div className="text-center py-8 text-gray-500">
          <p>Histórico de atividades será implementado em breve</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UserDetailsContent;
