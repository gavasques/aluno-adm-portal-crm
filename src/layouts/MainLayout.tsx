
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../layout/Layout";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  // Passing an empty object to ensure we're providing valid props
  // The issue is that Layout expects specific props defined in LayoutProps
  return (
    <Layout isAdmin={undefined}>
      <Outlet />
    </Layout>
  );
};
