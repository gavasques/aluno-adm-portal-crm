
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Layout from "../layout/Layout";

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  
  return (
    <Layout isAdmin={isAdmin}>
      <Outlet />
    </Layout>
  );
};
