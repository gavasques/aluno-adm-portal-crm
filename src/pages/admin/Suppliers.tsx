
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SupplierForm from "@/components/admin/SupplierForm";
import SupplierDetail from "@/components/admin/SupplierDetail";

// Dados de exemplo
const INITIAL_SUPPLIERS = [
  {
    id: 1,
    name: "Distribuidor Nacional",
    category: "Produtos Diversos",
    categoryId: 1,
    rating: 4.7,
    comments: 12,
    cnpj: "12.345.678/0001-90",
    email: "contato@distribuidornacional.com",
    phone: "(11) 98765-4321",
    website: "www.distribuidornacional.com",
    address: "Av. Exemplo, 1000 - São Paulo/SP",
    logo: "DN"
  },
  {
    id: 2,
    name: "Importadora Global",
    category: "Eletrônicos",
    categoryId: 2,
    rating: 4.2,
    comments: 8,
    cnpj: "98.765.432/0001-10",
    email: "contato@importadoraglobal.com",
    phone: "(11) 91234-5678",
    website: "www.importadoraglobal.com",
    address: "Rua Exemplo, 500 - São Paulo/SP",
    logo: "IG"
  },
  {
    id: 3,
    name: "Manufatura Express",
    category: "Vestuário",
    categoryId: 3,
    rating: 3.9,
    comments: 15,
    cnpj: "45.678.901/0001-23",
    email: "contato@manufaturaexpress.com",
    phone: "(11) 94567-8901",
    website: "www.manufaturaexpress.com",
    address: "Rua dos Exemplos, 200 - São Paulo/SP",
    logo: "ME"
  },
  {
    id: 4,
    name: "Tech Solution Distribuidora",
    category: "Tecnologia",
    categoryId: 2,
    rating: 4.5,
    comments: 23,
    cnpj: "34.567.890/0001-12",
    email: "contato@techsolution.com",
    phone: "(11) 93456-7890",
    website: "www.techsolution.com",
    address: "Av. Exemplar, 300 - São Paulo/SP",
    logo: "TS"
  },
  {
    id: 5,
    name: "Eco Produtos",
    category: "Sustentáveis",
    categoryId: 3,
    rating: 4.8,
    comments: 19,
    cnpj: "23.456.789/0001-01",
    email: "contato@ecoprodutos.com",
    phone: "(11) 92345-6789",
    website: "www.ecoprodutos.com",
    address: "Rua Sustentável, 100 - São Paulo/SP",
    logo: "EP"
  }
];

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filtrar fornecedores com base na pesquisa
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddSupplier = (newSupplier) => {
    const id = Math.max(...suppliers.map(s => s.id), 0) + 1;
    const supplierWithId = { ...newSupplier, id };
    setSuppliers([...suppliers, supplierWithId]);
    setIsDialogOpen(false);
  };
  
  const handleUpdateSupplier = (updatedSupplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    ));
    setSelectedSupplier(updatedSupplier);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Fornecedores</h1>
      
      {!selectedSupplier ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar fornecedores..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Fornecedor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
                </DialogHeader>
                <SupplierForm onSubmit={handleAddSupplier} />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card 
                key={supplier.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSupplier(supplier)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-portal-primary text-white flex items-center justify-center text-xl font-bold">
                      {supplier.logo || supplier.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"}
                          stroke="currentColor"
                          className="mr-0.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-600">({supplier.rating})</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="mr-1"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {supplier.comments}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredSuppliers.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Nenhum fornecedor encontrado. Tente outra busca ou adicione um novo fornecedor.
              </div>
            )}
          </div>
        </>
      ) : (
        <SupplierDetail 
          supplier={selectedSupplier}
          onBack={() => setSelectedSupplier(null)}
          onUpdate={handleUpdateSupplier}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default AdminSuppliers;
