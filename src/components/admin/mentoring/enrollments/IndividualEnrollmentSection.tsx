
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Plus, Filter, Grid, List } from 'lucide-react';
import EnrollmentCard from './EnrollmentCard';

interface IndividualEnrollmentSectionProps {
  viewMode?: "cards" | "list";
  onViewModeChange?: (mode: "cards" | "list") => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  enrollments: any[];
  selectedEnrollments: string[];
  onToggleSelection: (id: string) => void;
  onCreateEnrollment: () => void;
  onEditEnrollment: (enrollment: any) => void;
  onViewEnrollment: (enrollment: any) => void;
  onDeleteEnrollment: (id: string) => void;
  onAddExtension: (enrollment: any) => void;
  onBulkAction: (action: string) => void;
}

const IndividualEnrollmentSection: React.FC<IndividualEnrollmentSectionProps> = ({
  viewMode = "cards",
  onViewModeChange = () => {},
  searchQuery = "",
  onSearchChange = () => {},
  statusFilter = "",
  onStatusFilterChange = () => {},
  enrollments,
  selectedEnrollments,
  onToggleSelection,
  onCreateEnrollment,
  onEditEnrollment,
  onViewEnrollment,
  onDeleteEnrollment,
  onAddExtension,
  onBulkAction
}) => {
  const handleSelectAll = () => {
    if (selectedEnrollments.length === enrollments.length) {
      enrollments.forEach(e => onToggleSelection(e.id));
    } else {
      enrollments.forEach(e => {
        if (!selectedEnrollments.includes(e.id)) {
          onToggleSelection(e.id);
        }
      });
    }
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

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(enrollment => (
            <div key={enrollment.id}>
              <label className="peer-hover:bg-gray-100 transition-all rounded-lg overflow-hidden block">
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={selectedEnrollments.includes(enrollment.id)}
                  onChange={() => onToggleSelection(enrollment.id)}
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
                  <Button size="sm" onClick={() => onViewEnrollment(enrollment)}>
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
