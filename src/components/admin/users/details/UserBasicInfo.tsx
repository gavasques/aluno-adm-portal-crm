
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, CalendarClock } from "lucide-react";

interface UserBasicInfoProps {
  name: string;
  email: string;
  lastLogin: string;
}

const UserBasicInfo: React.FC<UserBasicInfoProps> = ({ name, email, lastLogin }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <User className="h-5 w-5 mt-0.5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{name}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="h-5 w-5 mt-0.5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarClock className="h-5 w-5 mt-0.5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Último Login</p>
              <p className="font-medium">{lastLogin}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBasicInfo;
