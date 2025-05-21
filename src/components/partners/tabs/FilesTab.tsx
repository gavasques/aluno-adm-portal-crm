
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { Partner } from "../PartnersTable";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface FilesTabProps {
  partner: Partner;
}

const FilesTab: React.FC<FilesTabProps> = ({ partner }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4
      }
    }
  };

  return (
    <div className="space-y-4">
      {partner.files && partner.files.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {partner.files.map((file, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white border border-purple-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-2"></div>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FileText className="h-6 w-6 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 line-clamp-1">{file.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="mr-2">{file.size}</span>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{file.date}</span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto p-2">
                          <p className="text-sm">Enviado por: {file.uploadedBy}</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-purple-100 hover:text-purple-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center py-10 px-6 bg-white/80 rounded-lg border border-dashed border-purple-200">
            <FileText className="h-12 w-12 mx-auto text-purple-300 mb-3" />
            <p className="text-gray-500 mb-4">
              Nenhum arquivo disponível para este parceiro.
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-sm hover:shadow-md transition-all">
              <FileText className="mr-2 h-4 w-4" />
              Adicionar Arquivo
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FilesTab;
