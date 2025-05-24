
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SupplierDetail from './SupplierDetail';

const SupplierDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock supplier data - in a real app, this would come from an API call
  const supplier = {
    id: id || '1',
    name: 'Fornecedor Exemplo',
    email: 'contato@fornecedor.com',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    cnpj: '12.345.678/0001-90',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const handleBack = () => {
    navigate('/admin/fornecedores');
  };

  const handleUpdate = (updatedSupplier: any) => {
    console.log('Supplier updated:', updatedSupplier);
    // In a real app, this would make an API call to update the supplier
  };

  return (
    <SupplierDetail
      supplier={supplier}
      onBack={handleBack}
      onUpdate={handleUpdate}
      isAdmin={true}
    />
  );
};

export default SupplierDetailWrapper;
