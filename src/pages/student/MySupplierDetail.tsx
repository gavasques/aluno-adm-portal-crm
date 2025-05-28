
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MySupplierDetailView } from '@/components/student/my-suppliers/MySupplierDetailView';

const MySupplierDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock supplier data - in a real app, this would come from an API call
  const supplier = {
    id: id || '1',
    user_id: 'user-1',
    name: 'Meu Fornecedor Exemplo',
    category: 'Tecnologia',
    cnpj: '12.345.678/0001-90',
    email: 'contato@meufornecedor.com',
    phone: '(11) 99999-9999',
    website: 'https://meufornecedor.com',
    address: 'Rua Exemplo, 123',
    type: 'Distribuidor',
    logo: '',
    rating: 4.5,
    comment_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brands: [],
    branches: [],
    contacts: [],
    communications: [],
    ratings: [],
    commentItems: [],
    files: [],
    images: []
  };

  const handleBack = () => {
    navigate('/aluno/meus-fornecedores');
  };

  const handleUpdate = (updatedSupplier: any) => {
    console.log('My Supplier updated:', updatedSupplier);
    // In a real app, this would make an API call to update the supplier
  };

  return (
    <MySupplierDetailView
      supplier={supplier}
      onBack={handleBack}
      onUpdate={handleUpdate}
    />
  );
};

export default MySupplierDetailPage;
