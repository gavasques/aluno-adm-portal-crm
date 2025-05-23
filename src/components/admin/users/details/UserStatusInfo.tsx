
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Shield, Award } from "lucide-react";

interface UserStatusInfoProps {
  role: string;
  status: string;
}

const UserStatusInfo: React.FC<UserStatusInfoProps> = ({ role, status }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Status e Permissões</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 mt-0.5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Papel</p>
              <Badge
                variant={role === "Admin" ? "default" : "outline"}
                className={
                  role === "Admin"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {role}
              </Badge>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Award className="h-5 w-5 mt-0.5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatusInfo;
