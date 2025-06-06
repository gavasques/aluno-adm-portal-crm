
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Layout from './Layout';

const StudentLayout: React.FC = () => {
  const location = useLocation();
  
  // Se estiver na rota raiz do aluno (/aluno), redirecionar para dashboard
  React.useEffect(() => {
    if (location.pathname === '/aluno/') {
      window.history.replaceState(null, '', '/aluno');
    }
  }, [location.pathname]);

  return (
    <Layout isAdmin={false}>
      <Outlet />
    </Layout>
  );
};

export default StudentLayout;
