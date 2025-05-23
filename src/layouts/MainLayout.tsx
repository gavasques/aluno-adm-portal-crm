
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../layout/Layout";

// Não precisa de props!
export const MainLayout: React.FC = () => {
  return (
    <Layout isAdmin={undefined}>
      <Outlet />
    </Layout>
  );
};
