
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, Mail } from 'lucide-react';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';

interface Mentor {
  id: string;
  name: string;
  email: string;
}

interface MentorSelectionFieldProps {
  selectedMentor: Mentor | null;
  onMentorSelect: (mentor: Mentor) => void;
}

export const MentorSelectionField = ({ selectedMentor, onMentorSelect }: MentorSelectionFieldProps) => {
  const { mentors, loading } = useMentorsForEnrollment();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMentorSelect = (mentor: Mentor) => {
    onMentorSelect(mentor);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Mentor Responsável *
      </Label>
      
      {selectedMentor ? (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-purple-900">{selectedMentor.name}</p>
                <p className="text-sm text-purple-700">{selectedMentor.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMentorSelect(null as any)}
              className="text-purple-700 border-purple-300 hover:bg-purple-100"
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
              placeholder="Digite o nome ou email do mentor..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="pl-10 pr-4"
              disabled={loading}
            />
          </div>
          
          {isOpen && searchTerm && (
            <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto border shadow-lg">
              <CardContent className="p-2">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Carregando mentores...
                  </div>
                ) : filteredMentors.length > 0 ? (
                  <div className="space-y-1">
                    {filteredMentors.map((mentor) => (
                      <div
                        key={mentor.id}
                        className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleMentorSelect(mentor)}
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{mentor.name}</p>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-600">{mentor.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                          Mentor
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Nenhum mentor encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
