
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import BrandsTab from "@/components/student/supplier-tabs/BrandsTab";

interface MarcasTabProps {
  brands: any[];
  isEditing: boolean;
  onUpdate: (brands: any[]) => void;
}

const MarcasTab: React.FC<MarcasTabProps> = ({ brands, isEditing, onUpdate }) => {
  return (
    <ScrollArea className="h-[400px]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        {brands && brands.length > 0 ? (
          brands.map((brand, index) => (
            <motion.div
              key={brand.id || index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <HoverCard>
                <HoverCardTrigger>
                  <Badge
                    variant="secondary" 
                    className="text-sm py-2 bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 border border-blue-200 shadow-sm hover:shadow-md transition-all"
                  >
                    {brand.name}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 bg-white p-4 shadow-lg rounded-lg border border-blue-200">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-semibold text-blue-700">{brand.name}</h4>
                    <div className="text-sm text-gray-600">
                      <p>Marca do fornecedor</p>
                      <p className="mt-2 text-blue-600 text-xs">Clique para mais detalhes</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="text-gray-500 flex flex-col items-center justify-center w-full py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-sky-100 flex items-center justify-center mb-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M8 2c1.981 0 3.671 1.178 4.432 2.872"/>
                <path d="M2 9.5c0 1.847.29 3 1 4"/>
                <path d="M4.5 21h6.499a3 3 0 0 0 2.103-.86l8.388-8.387a3 3 0 0 0 0-4.242l-1.06-1.06a3 3 0 0 0-4.243 0L8.14 14.397A3 3 0 0 0 7.28 16.5L7 21"/>
                <path d="M8 15h-.5a2 2 0 0 0-2 2v.5"/>
              </svg>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Nenhuma marca cadastrada.
            </motion.p>
          </motion.div>
        )}
      </motion.div>
      
      {isEditing && (
        <BrandsTab 
          brands={brands}
          onUpdate={onUpdate}
        />
      )}
    </ScrollArea>
  );
};

export default MarcasTab;
