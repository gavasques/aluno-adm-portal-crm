
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActiveUsersForEnrollment } from '@/hooks/admin/useActiveUsersForEnrollment';

interface StudentMentoringSelectorProps {
  selectedStudentId: string | null;
  onStudentSelect: (studentId: string) => void;
}

const StudentMentoringSelector: React.FC<StudentMentoringSelectorProps> = ({ selectedStudentId, onStudentSelect }) => {
  const { users, loading } = useActiveUsersForEnrollment();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <Label htmlFor="student">Selecione o Usuário</Label>
      <Select onValueChange={onStudentSelect} defaultValue={selectedStudentId || ""}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="" disabled>Carregando...</SelectItem>
          ) : (
            filteredUsers.map((user) => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudentMentoringSelector;
