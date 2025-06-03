
import React from "react";
import { motion } from "framer-motion";
import { SidebarLogo } from "./admin-sidebar/SidebarLogo";
import { SidebarMenuGroup } from "./admin-sidebar/SidebarMenuGroup";
import { SidebarUserMenu } from "./admin-sidebar/SidebarUserMenu";
import { menuGroups } from "./admin-sidebar/menuData";

const ModernAdminSidebar = () => {
  return (
    <motion.div 
      className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50 shadow-lg"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Logo */}
      <SidebarLogo />

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {menuGroups.map((group) => (
          <SidebarMenuGroup
            key={group.title}
            title={group.title}
            items={group.items}
          />
        ))}
      </nav>

      {/* User Menu */}
      <SidebarUserMenu />
    </motion.div>
  );
};

export default ModernAdminSidebar;
