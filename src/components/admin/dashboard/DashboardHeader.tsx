
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Settings, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <motion.h1 
            className="text-2xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Dashboard Administrativo
          </motion.h1>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              Sistema Online
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              125 Usuários Ativos
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Campo de Busca */}
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar usuários, fornecedores, mentorias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hover:bg-blue-50">
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin/configuracoes')}
              className="hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              Novo
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
