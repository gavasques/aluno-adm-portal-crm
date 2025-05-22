
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative w-full sm:w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        placeholder="Buscar usuários..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default UserSearchBar;
