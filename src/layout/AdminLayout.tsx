
import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';

const AdminLayout: React.FC = () => {
  return (
    <Layout isAdmin={true}>
      <Outlet />
    </Layout>
  );
};

export default AdminLayout;
