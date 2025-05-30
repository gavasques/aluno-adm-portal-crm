
import React from "react";
import { motion } from "framer-motion";
import { SidebarLogo } from "./admin-sidebar/SidebarLogo";
import { SidebarMenuGroup } from "./admin-sidebar/SidebarMenuGroup";
import { SidebarUserMenu } from "./admin-sidebar/SidebarUserMenu";
import { menuGroups } from "./admin-sidebar/menuData";

const ModernAdminSidebar = () => {
  return (
    <motion.div 
      className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/20 flex flex-col z-50 backdrop-blur-xl"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Logo */}
      <SidebarLogo />

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
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

      {/* Decorative elements */}
      <div className="absolute top-20 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-44 right-2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    </motion.div>
  );
};

export default ModernAdminSidebar;
