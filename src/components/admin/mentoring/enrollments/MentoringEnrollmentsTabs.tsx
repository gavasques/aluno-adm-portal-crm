
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IndividualEnrollmentSection from './IndividualEnrollmentSection';
import { GroupEnrollmentSection } from './GroupEnrollmentSection';
import { StudentMentoringEnrollment, GroupEnrollment } from '@/types/mentoring.types';

interface MentoringEnrollmentsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  filteredIndividualEnrollments: StudentMentoringEnrollment[];
  filteredGroups: GroupEnrollment[];
  viewMode: 'cards' | 'list';
  selectedEnrollments: string[];
  selectedGroups: string[];
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleEnrollmentSelection: (id: string) => void;
  onSelectAllIndividual: () => void;
  onAddEnrollment: () => void;
  onViewGroup: (group: GroupEnrollment) => void;
  onEditGroup: (group: GroupEnrollment) => void;
  onDeleteGroup: (id: string) => void;
  onAddStudent: (group: GroupEnrollment) => void;
  onRemoveStudent: (groupId: string, studentId: string) => void;
  onToggleGroupSelection: (id: string) => void;
  onAddGroup: () => void;
}

export const MentoringEnrollmentsTabs: React.FC<MentoringEnrollmentsTabsProps> = ({
  activeTab,
  onTabChange,
  filteredIndividualEnrollments,
  filteredGroups,
  viewMode,
  selectedEnrollments,
  selectedGroups,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleEnrollmentSelection,
  onSelectAllIndividual,
  onAddEnrollment,
  onViewGroup,
  onEditGroup,
  onDeleteGroup,
  onAddStudent,
  onRemoveStudent,
  onToggleGroupSelection,
  onAddGroup
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="individual" className="flex items-center gap-2">
          Inscrições Individuais
          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
            {filteredIndividualEnrollments.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="group" className="flex items-center gap-2">
          Inscrições em Grupo
          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
            {filteredGroups.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="individual" className="mt-6">
        <IndividualEnrollmentSection
          enrollments={filteredIndividualEnrollments}
          viewMode={viewMode}
          selectedEnrollments={selectedEnrollments}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddExtension={onAddExtension}
          onToggleSelection={onToggleEnrollmentSelection}
          onSelectAll={onSelectAllIndividual}
          onAddEnrollment={onAddEnrollment}
        />
      </TabsContent>

      <TabsContent value="group" className="mt-6">
        <GroupEnrollmentSection
          groups={filteredGroups}
          selectedGroups={selectedGroups}
          onView={onViewGroup}
          onEdit={onEditGroup}
          onDelete={onDeleteGroup}
          onAddStudent={onAddStudent}
          onRemoveStudent={onRemoveStudent}
          onToggleSelection={onToggleGroupSelection}
          onAddGroup={onAddGroup}
        />
      </TabsContent>
    </Tabs>
  );
};
