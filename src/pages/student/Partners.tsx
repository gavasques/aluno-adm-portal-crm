
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Star, MessageCircle } from "lucide-react";

// Sample data for partners
const PARTNERS = [
  {
    id: 1,
    name: "Marketing Digital Pro",
    category: "Marketing Digital",
    rating: 4.8,
    comments: 14,
    logo: "MP"
  },
  {
    id: 2,
    name: "Logística Express",
    category: "Logística",
    rating: 4.3,
    comments: 7,
    logo: "LE"
  },
  {
    id: 3,
    name: "Contabilidade Online",
    category: "Contabilidade",
    rating: 4.6,
    comments: 9,
    logo: "CO"
  },
];

const Partners = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter partners based on search query
  const filteredPartners = PARTNERS.filter(partner => 
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Parceiros</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <Card 
            key={partner.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-portal-secondary text-white flex items-center justify-center text-xl font-bold">
                  {partner.logo}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{partner.name}</h3>
                  <p className="text-sm text-gray-500">{partner.category}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="mr-0.5" 
                      fill={i < Math.floor(partner.rating) ? "currentColor" : "none"} 
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({partner.rating})</span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <MessageCircle size={16} className="mr-1" />
                  {partner.comments}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                Empresa parceira especializada em {partner.category.toLowerCase()} para e-commerce.
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

export default Partners;
