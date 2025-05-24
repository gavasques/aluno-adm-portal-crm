
import React from 'react';
import Layout from './Layout';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  return <Layout isAdmin={false}>{children}</Layout>;
};

export default StudentLayout;
