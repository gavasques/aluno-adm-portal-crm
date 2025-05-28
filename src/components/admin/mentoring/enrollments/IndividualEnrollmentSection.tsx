import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Plus, Filter, Grid, List } from 'lucide-react';

// Import com default export
import EnrollmentCard from './EnrollmentCard';

interface IndividualEnrollmentSectionProps {
  enrollments: any[];
  selectedEnrollments: string[];
  onView: (enrollment: any) => void;
  onEdit: (enrollment: any) => void;
  onDelete: (enrollment: any) => void;
  onAddExtension: (enrollment: any) => void;
  onToggleEnrollmentSelection: (enrollmentId: string) => void;
  onSelectAll: () => void;
  viewMode: 'grid' | 'list';
}

const IndividualEnrollmentSection: React.FC<IndividualEnrollmentSectionProps> = ({
  enrollments,
  selectedEnrollments,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleEnrollmentSelection,
  onSelectAll,
  viewMode
}) => {
  const handleSelectAll = () => {
    onSelectAll();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5 mr-2" />
          Inscrições Individuais ({enrollments.length})
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            <Plus className="h-4 w-4 mr-2" />
            Selecionar Todos
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(enrollment => (
            <div key={enrollment.id}>
              <label className="peer-hover:bg-gray-100 transition-all rounded-lg overflow-hidden block">
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={selectedEnrollments.includes(enrollment.id)}
                  onChange={() => onToggleEnrollmentSelection(enrollment.id)}
                />
                <EnrollmentCard enrollment={enrollment} />
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map(enrollment => (
            <div key={enrollment.id} className="bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="text-sm font-semibold">{enrollment.mentoring_title}</h3>
                  <p className="text-xs text-gray-500">{enrollment.student_email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{enrollment.status}</Badge>
                  <Button size="sm" onClick={() => onView(enrollment)}>
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndividualEnrollmentSection;
