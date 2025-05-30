
import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';

const StudentLayout: React.FC = () => {
  return (
    <Layout isAdmin={false}>
      <Outlet />
    </Layout>
  );
};

export default StudentLayout;
