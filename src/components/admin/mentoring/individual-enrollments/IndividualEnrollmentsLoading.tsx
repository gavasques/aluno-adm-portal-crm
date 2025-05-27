
import React from 'react';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Mentorias', href: '/admin/mentorias' },
  { label: 'Individuais' }
];

export const IndividualEnrollmentsLoading = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-4"
      />
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando inscrições...</p>
        </div>
      </div>
    </div>
  );
};
