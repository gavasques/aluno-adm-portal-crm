
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, Mail, Loader2 } from 'lucide-react';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface StudentSearchFieldProps {
  selectedStudent: Student | null;
  onStudentSelect: (student: Student) => void;
}

export const StudentSearchField = ({ selectedStudent, onStudentSelect }: StudentSearchFieldProps) => {
  const { students, loading } = useStudentsForEnrollment();
  const [isOpen, setIsOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useDebouncedSearch('', { delay: 300, minLength: 2 });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (student: Student) => {
    onStudentSelect(student);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onStudentSelect(null as any);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Aluno *
      </Label>
      
      {selectedStudent ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">{selectedStudent.name}</p>
                <div className="flex items-center space-x-2 text-sm text-green-700">
                  <Mail className="w-3 h-3" />
                  <span>{selectedStudent.email}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              Alterar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Digite o nome ou email do aluno para buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(e.target.value.length >= 2);
              }}
              onFocus={() => setIsOpen(searchTerm.length >= 2)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              className="pl-10 pr-4 h-12"
              disabled={loading}
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
            )}
          </div>
          
          {isOpen && (
            <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto border shadow-lg bg-white">
              <CardContent className="p-2">
                {loading ? (
                  <div className="p-4 text-center text-gray-500 flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Carregando alunos...</span>
                  </div>
                ) : searchTerm.length < 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    Digite pelo menos 2 caracteres para buscar
                  </div>
                ) : filteredStudents.length > 0 ? (
                  <div className="space-y-1">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleStudentSelect(student)}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Nenhum aluno encontrado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Tente buscar por nome ou email
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {!selectedStudent && (
        <p className="text-xs text-gray-500 mt-1">
          Digite pelo menos 2 caracteres para buscar alunos cadastrados
        </p>
      )}
    </div>
  );
};
