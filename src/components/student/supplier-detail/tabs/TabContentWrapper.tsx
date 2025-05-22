
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TabContentWrapperProps {
  activeTab: string;
  children: React.ReactNode;
}

const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ activeTab, children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TabContentWrapper;
