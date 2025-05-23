
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../layout/Layout";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <Layout isAdmin={undefined}>
      <Outlet />
    </Layout>
  );
};
