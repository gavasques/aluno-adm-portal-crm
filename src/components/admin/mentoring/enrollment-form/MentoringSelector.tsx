
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MentoringCatalog } from '@/types/mentoring.types';
import { expandedMentoringData } from '@/data/expandedMentoringData';

interface MentoringSelectorProps {
  onMentoringSelect: (mentoring: MentoringCatalog) => void;
  selectedMentoringId: string;
}

const MentoringSelector: React.FC<MentoringSelectorProps> = ({
  onMentoringSelect,
  selectedMentoringId
}) => {
  const activeMentorings = expandedMentoringData.filter(m => m.active);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activeMentorings.map(mentoring => (
        <Card
          key={mentoring.id}
          className={`cursor-pointer transition-all ${
            selectedMentoringId === mentoring.id
              ? 'ring-2 ring-blue-500 border-blue-500'
              : 'hover:shadow-md'
          }`}
          onClick={() => onMentoringSelect(mentoring)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{mentoring.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">{mentoring.type}</Badge>
                <Badge variant="outline">{mentoring.durationMonths} meses</Badge>
              </div>
              <p className="text-xs text-gray-600">{mentoring.description}</p>
              <p className="text-sm font-semibold text-green-600">
                R$ {mentoring.price.toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MentoringSelector;
