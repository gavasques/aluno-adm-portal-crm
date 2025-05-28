
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SupplierDetail from '@/components/student/SupplierDetail';

const SupplierDetailPage = () => {
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
    category: 'Tecnologia',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [],
    communications: [],
    brands: [],
    branches: [],
    contacts: [],
    files: [],
    ratings: [],
    comments: []
  };

  const handleBack = () => {
    navigate('/aluno/fornecedores');
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
    />
  );
};

export default SupplierDetailPage;
