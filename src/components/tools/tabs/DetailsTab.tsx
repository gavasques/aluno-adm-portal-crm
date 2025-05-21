
import React from "react";
import { motion } from "framer-motion";
import { Tool } from "@/components/tools/ToolsTable";
import { Link, ExternalLink, Tag, Award, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DetailsTabProps {
  tool: Tool;
  isAdmin?: boolean;
  onSave?: (data: any) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ tool, isAdmin, onSave }) => {
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.5
      } 
    })
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-white rounded-lg shadow-sm overflow-hidden border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-b bg-gray-50 px-4 py-3">
          <h3 className="font-medium text-gray-700">Informações Gerais</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              custom={0} 
              variants={fadeIn} 
              initial="hidden" 
              animate="visible"
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
            >
              <p className="text-sm font-medium text-blue-700 mb-1">Descrição</p>
              <p className="text-gray-700">{tool.description}</p>
            </motion.div>
            
            <motion.div
              custom={1}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-700 mb-1">Categoria</p>
                <p className="text-gray-700">{tool.category}</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-700 mb-1">Fornecedor</p>
                <p className="text-gray-700">{tool.provider}</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            custom={2} 
            variants={fadeIn} 
            initial="hidden" 
            animate="visible"
            className="mt-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium text-gray-700">Status e Recomendação</h4>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge 
                className={`${tool.status === 'Ativo' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Status: {tool.status}
              </Badge>
              
              {tool.recommended && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  <Award className="h-3 w-3 mr-1" /> Recomendado
                </Badge>
              )}
              
              {tool.notRecommended && (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                  <X className="h-3 w-3 mr-1" /> Não Recomendado
                </Badge>
              )}
              
              {tool.canal && (
                <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                  Canal: {tool.canal}
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Website e contato */}
      <motion.div 
        className="bg-white rounded-lg shadow-sm overflow-hidden border"
        custom={3} 
        variants={fadeIn} 
        initial="hidden" 
        animate="visible"
      >
        <div className="border-b bg-gray-50 px-4 py-3">
          <h3 className="font-medium text-gray-700">Contato e Website</h3>
        </div>
        
        <div className="p-4 space-y-4">
          {tool.website && (
            <motion.div 
              className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <ExternalLink className="h-4 w-4 text-blue-600" />
              <a 
                href={`https://${tool.website}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                {tool.website}
              </a>
            </motion.div>
          )}
          
          {tool.email && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
              <Link className="h-4 w-4 text-purple-600" />
              <a 
                href={`mailto:${tool.email}`}
                className="text-purple-600 hover:underline font-medium"
              >
                {tool.email}
              </a>
            </div>
          )}
          
          {tool.phone && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
              <Link className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 font-medium">{tool.phone}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Cupons */}
      {tool.coupons && (
        <motion.div 
          className="bg-white rounded-lg shadow-sm overflow-hidden border"
          custom={4} 
          variants={fadeIn} 
          initial="hidden" 
          animate="visible"
        >
          <div className="border-b bg-gray-50 px-4 py-3">
            <h3 className="font-medium text-gray-700">Cupons Disponíveis</h3>
          </div>
          
          <div className="p-4">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="whitespace-pre-line font-medium text-amber-800">
                {tool.coupons}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DetailsTab;
