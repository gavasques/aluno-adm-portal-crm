
import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';

const AdminLayout: React.FC = () => {
  return (
    <Layout isAdmin={true}>
      <div className="h-full w-full">
        <Outlet />
      </div>
    </Layout>
  );
};

export default AdminLayout;
