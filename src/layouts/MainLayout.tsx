
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../layout/Layout";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    // The Layout component is using Outlet internally and does not expect children
    // as a prop. It only expects isAdmin as an optional prop.
    <Layout isAdmin={undefined} />
  );
};
