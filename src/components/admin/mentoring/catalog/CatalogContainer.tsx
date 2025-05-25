
import React from 'react';
import CatalogContent from './CatalogContent';

const CatalogContainer: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <CatalogContent />
    </div>
  );
};

export default CatalogContainer;
