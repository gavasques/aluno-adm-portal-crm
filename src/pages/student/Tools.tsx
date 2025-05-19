
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, MessageCircle, Settings } from "lucide-react";

// Sample data for tools
const TOOLS = [
  {
    id: 1,
    name: "ERP Commerce",
    category: "Gestão Empresarial",
    rating: 4.7,
    comments: 18,
    logo: "EC"
  },
  {
    id: 2,
    name: "Email Marketing Pro",
    category: "Marketing",
    rating: 4.5,
    comments: 12,
    logo: "EM"
  },
  {
    id: 3,
    name: "Gestor de Estoque",
    category: "Logística",
    rating: 4.2,
    comments: 9,
    logo: "GE"
  },
  {
    id: 4,
    name: "Analytics Dashboard",
    category: "Análise de Dados",
    rating: 4.8,
    comments: 15,
    logo: "AD"
  },
];

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter tools based on search query
  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Ferramentas</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar ferramentas..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-portal-accent text-white flex items-center justify-center text-xl font-bold">
                  {tool.logo}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{tool.name}</h3>
                  <p className="text-sm text-gray-500">{tool.category}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="mr-0.5" 
                      fill={i < Math.floor(tool.rating) ? "currentColor" : "none"} 
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({tool.rating})</span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <MessageCircle size={16} className="mr-1" />
                  {tool.comments}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                Ferramenta para {tool.category.toLowerCase()} com foco em e-commerce.
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">Ver Detalhes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tools;
