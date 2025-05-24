
import React from "react";
import { Partner } from "@/types/partner.types";
import { motion } from "framer-motion";

interface DetailsTabProps {
  partner: Partner;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ partner }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.5
      } 
    })
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <motion.div 
        custom={0} 
        variants={itemVariants}
        className="bg-white/80 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <h3 className="text-sm font-medium text-blue-600 mb-1">Nome</h3>
        <p className="text-base font-medium">{partner.name}</p>
      </motion.div>

      <motion.div 
        custom={1} 
        variants={itemVariants}
        className="bg-white/80 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <h3 className="text-sm font-medium text-blue-600 mb-1">Categoria</h3>
        <p className="text-base font-medium">{partner.category}</p>
      </motion.div>

      <motion.div 
        custom={2} 
        variants={itemVariants}
        className="bg-white/80 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <h3 className="text-sm font-medium text-blue-600 mb-1">Tipo</h3>
        <p className="text-base font-medium">{partner.type}</p>
      </motion.div>

      <motion.div 
        custom={3} 
        variants={itemVariants}
        className="col-span-3 bg-white/80 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <h3 className="text-sm font-medium text-blue-600 mb-1">Descrição</h3>
        <p className="text-base">{partner.description}</p>
      </motion.div>

      {partner.website && (
        <motion.div 
          custom={4} 
          variants={itemVariants}
          className="col-span-3 bg-white/80 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h3 className="text-sm font-medium text-blue-600 mb-1">Website</h3>
          <a 
            href={partner.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 underline"
          >
            {partner.website}
          </a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DetailsTab;
