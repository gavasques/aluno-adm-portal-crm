
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../layout/Layout";

export const MainLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
