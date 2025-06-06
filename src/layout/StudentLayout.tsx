
import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Layout from './Layout';

const StudentLayout: React.FC = () => {
  const location = useLocation();
  
  // Se estiver na rota /aluno/home, redirecionar para /aluno
  if (location.pathname === '/aluno/home') {
    return <Navigate to="/aluno" replace />;
  }

  return (
    <Layout isAdmin={false}>
      <Outlet />
    </Layout>
  );
};

export default StudentLayout;
