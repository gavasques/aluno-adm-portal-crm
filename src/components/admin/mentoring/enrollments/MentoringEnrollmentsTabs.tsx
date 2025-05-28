
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import IndividualEnrollmentSection from './IndividualEnrollmentSection';
import { GroupEnrollmentSection } from './GroupEnrollmentSection';

interface MentoringEnrollmentsTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  viewMode: "cards" | "list";
  onViewModeChange: (mode: "cards" | "list") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  enrollments: any[];
  groups: any[];
  selectedEnrollments: string[];
  selectedGroups: string[];
  onToggleEnrollmentSelection: (id: string) => void;
  onToggleGroupSelection: (id: string) => void;
  onCreateEnrollment: () => void;
  onEditEnrollment: (enrollment: any) => void;
  onViewEnrollment: (enrollment: any) => void;
  onDeleteEnrollment: (id: string) => void;
  onAddExtension: (enrollment: any) => void;
  onViewGroup: (group: any) => void;
  onEditGroup: (group: any) => void;
  onDeleteGroup: (id: string) => void;
  onAddStudent: (group: any) => void;
  onRemoveStudent: (groupId: string, studentId: string) => void;
  onAddGroup: () => void;
  onBulkAction: (action: string, selectedEnrollments: string[], selectedGroups: string[]) => void;
}

const MentoringEnrollmentsTabs: React.FC<MentoringEnrollmentsTabsProps> = ({
  selectedTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  enrollments,
  groups,
  selectedEnrollments,
  selectedGroups,
  onToggleEnrollmentSelection,
  onToggleGroupSelection,
  onCreateEnrollment,
  onEditEnrollment,
  onViewEnrollment,
  onDeleteEnrollment,
  onAddExtension,
  onViewGroup,
  onEditGroup,
  onDeleteGroup,
  onAddStudent,
  onRemoveStudent,
  onAddGroup,
  onBulkAction
}) => {
  return (
    <Card className="w-full">
      <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Inscrições Individuais</TabsTrigger>
          <TabsTrigger value="group">Inscrições em Grupo</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <IndividualEnrollmentSection
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
            enrollments={enrollments}
            selectedEnrollments={selectedEnrollments}
            onToggleSelection={onToggleEnrollmentSelection}
            onCreateEnrollment={onCreateEnrollment}
            onEditEnrollment={onEditEnrollment}
            onViewEnrollment={onViewEnrollment}
            onDeleteEnrollment={onDeleteEnrollment}
            onAddExtension={onAddExtension}
            onBulkAction={(action) => onBulkAction(action, selectedEnrollments, [])}
          />
        </TabsContent>

        <TabsContent value="group" className="space-y-4">
          <GroupEnrollmentSection
            groups={groups}
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
    </Card>
  );
};

export default MentoringEnrollmentsTabs;
