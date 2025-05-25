
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Clock,
  GraduationCap
} from "lucide-react";
import UserBasicInfo from "./UserBasicInfo";
import UserStatusInfo from "./UserStatusInfo";
import UserStorageDetails from "./UserStorageDetails";
import MentorToggleButton from "../MentorToggleButton";

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
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserBasicInfo user={user} />
          
          {/* Seção de Mentor */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Status de Mentor</span>
                {user.is_mentor && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Mentor
                  </Badge>
                )}
              </div>
              <MentorToggleButton
                userId={user.id}
                userEmail={user.email}
                userName={user.name}
                isMentor={user.is_mentor || false}
                onUpdate={onRefresh}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {user.is_mentor 
                ? "Este usuário tem privilégios de mentor no sistema." 
                : "Este usuário não é um mentor."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status e Permissões */}
      <UserStatusInfo user={user} />

      {/* Armazenamento */}
      <UserStorageDetails user={user} />
    </div>
  );
};

export default UserDetailsContent;
