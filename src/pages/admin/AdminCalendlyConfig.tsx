
import React from 'react';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { CalendlyConfigList } from '@/components/admin/calendly/CalendlyConfigList';

const AdminCalendlyConfig = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Configurações Calendly' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-4"
      />

      {/* Content */}
      <CalendlyConfigList />
    </div>
  );
};

export default AdminCalendlyConfig;
