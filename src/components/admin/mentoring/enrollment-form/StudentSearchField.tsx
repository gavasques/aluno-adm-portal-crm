
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useActiveUsersForEnrollment } from '@/hooks/admin/useActiveUsersForEnrollment';
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface StudentSearchFieldProps {
  selectedStudent: User | null;
  onStudentSelect: (student: User) => void;
  onClear: () => void;
}

const StudentSearchField: React.FC<StudentSearchFieldProps> = ({ selectedStudent, onStudentSelect, onClear }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { users = [], loading } = useActiveUsersForEnrollment();

  console.log('🔍 StudentSearchField - Estado atual:', {
    usersLength: users?.length || 0,
    loading,
    selectedStudent: selectedStudent?.name,
    searchValue
  });

  // Ensure users is always an array and filter safely
  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter(user => {
    if (!user || typeof user !== 'object') return false;
    
    const userName = user.name || '';
    const userEmail = user.email || '';
    const search = searchValue.toLowerCase();
    
    return userName.toLowerCase().includes(search) || 
           userEmail.toLowerCase().includes(search);
  });

  const handleUserSelect = (user: User) => {
    console.log('👤 Usuário selecionado:', user);
    onStudentSelect(user);
    setOpen(false);
    setSearchValue("");
  };

  if (loading) {
    return (
      <div className="grid gap-2">
        <Label htmlFor="student">Usuário</Label>
        <Input
          id="student"
          placeholder="Carregando usuários..."
          disabled
          className="h-9"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="student">Usuário</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 justify-between"
          >
            {selectedStudent ? (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="truncate">{selectedStudent.name}</span>
              </div>
            ) : (
              "Selecione um usuário..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <div className="flex flex-col">
            <div className="p-3">
              <Input
                placeholder="Buscar usuário..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-8"
              />
            </div>
            <ScrollArea className="h-72">
              <div className="p-1">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
                      onClick={() => handleUserSelect(user)}
                    >
                      <Check
                        className="mr-2 h-4 w-4"
                        style={{
                          opacity: selectedStudent?.id === user.id ? 1 : 0,
                        }}
                      />
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    {searchValue ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StudentSearchField;
