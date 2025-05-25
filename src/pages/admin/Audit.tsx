
import React from 'react';
import { AuditDashboard } from '@/components/admin/audit/AuditDashboard';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

const Audit: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Auditoria' }
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-6"
      />
      
      <AuditDashboard />
    </div>
  );
};

export default Audit;
