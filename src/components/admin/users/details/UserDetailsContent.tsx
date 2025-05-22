
import React from "react";
import UserBasicInfo from "./UserBasicInfo";
import UserStatusInfo from "./UserStatusInfo";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  tasks?: any[];
}

interface UserDetailsContentProps {
  user: User;
}

const UserDetailsContent: React.FC<UserDetailsContentProps> = ({ user }) => {
  return (
    <div className="py-4 grid gap-4 md:grid-cols-2">
      <UserBasicInfo
        name={user.name}
        email={user.email}
        lastLogin={user.lastLogin}
      />
      <UserStatusInfo role={user.role} status={user.status} />
    </div>
  );
};

export default UserDetailsContent;
