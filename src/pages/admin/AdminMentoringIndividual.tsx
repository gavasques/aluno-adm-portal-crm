
import React from "react";
import IndividualEnrollmentsContent from "@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsContent";

const AdminMentoringIndividual = () => {
  // Mock data temporário para resolver o erro de propriedades obrigatórias
  const mockEnrollments = [];

  return (
    <div className="space-y-4">
      <IndividualEnrollmentsContent 
        enrollments={mockEnrollments}
        viewMode="cards"
        selectedEnrollments={[]}
        onToggleSelection={() => {}}
        onView={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onAddExtension={() => {}}
      />
    </div>
  );
};

export default AdminMentoringIndividual;
