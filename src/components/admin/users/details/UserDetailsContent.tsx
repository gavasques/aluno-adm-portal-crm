
import React from "react";
import UserBasicInfo from "./UserBasicInfo";
import UserStatusInfo from "./UserStatusInfo";
import UserStorageDetails from "./UserStorageDetails";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  storage_used_mb?: number;
  storage_limit_mb?: number;
  tasks?: any[];
}

interface UserDetailsContentProps {
  user: User;
}

const UserDetailsContent: React.FC<UserDetailsContentProps> = ({ user }) => {
  return (
    <div className="py-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <UserBasicInfo
          name={user.name}
          email={user.email}
          lastLogin={user.lastLogin}
        />
        <UserStatusInfo role={user.role} status={user.status} />
      </div>
      
      <UserStorageDetails
        userId={user.id}
        userName={user.name || user.email}
        storageUsedMb={user.storage_used_mb || 0}
        storageLimitMb={user.storage_limit_mb || 100}
      />
    </div>
  );
};

export default UserDetailsContent;
