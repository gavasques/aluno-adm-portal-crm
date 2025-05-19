
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Users, Star, MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Sample data for my suppliers
const MY_SUPPLIERS = [
  {
    id: 1,
    name: "Meu Fornecedor Local",
    category: "Produtos Regionais",
    rating: 4.5,
    comments: 3,
    logo: "ML"
  }
];

const MySuppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    category: "",
    contact: "",
    email: "",
    phone: ""
  });
  
  // Filter suppliers based on search query
  const filteredSuppliers = MY_SUPPLIERS.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddSupplier = () => {
    // Validate form
    if (!newSupplier.name || !newSupplier.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e categoria do fornecedor.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically add the supplier to your database
    // For this demo, we'll just show a success message
    
    toast({
      title: "Fornecedor adicionado",
      description: `${newSupplier.name} foi adicionado com sucesso.`,
    });
    
    // Reset form and close dialog
    setNewSupplier({
      name: "",
      category: "",
      contact: "",
      email: "",
      phone: ""
    });
    
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Meus Fornecedores</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar meus fornecedores..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Fornecedor
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card 
            key={supplier.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-portal-primary text-white flex items-center justify-center text-xl font-bold">
                  {supplier.logo}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{supplier.name}</h3>
                  <p className="text-sm text-gray-500">{supplier.category}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="mr-0.5" 
                      fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({supplier.rating})</span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <MessageCircle size={16} className="mr-1" />
                  {supplier.comments}
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">Gerenciar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add Supplier Card */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed" onClick={() => setIsAddDialogOpen(true)}>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-14 h-14 rounded-full bg-portal-light flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-portal-primary" />
            </div>
            <h3 className="font-medium text-lg text-portal-primary mb-2">Adicionar Novo Fornecedor</h3>
            <p className="text-sm text-gray-500 text-center">
              Clique aqui para cadastrar um novo fornecedor em sua lista
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Supplier Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right font-medium">
                Nome*
              </label>
              <Input
                id="name"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                placeholder="Nome do fornecedor"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right font-medium">
                Categoria*
              </label>
              <Input
                id="category"
                value={newSupplier.category}
                onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                placeholder="Categoria principal"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="contact" className="text-right font-medium">
                Contato
              </label>
              <Input
                id="contact"
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                placeholder="Nome do contato"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                placeholder="email@exemplo.com"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right font-medium">
                Telefone
              </label>
              <Input
                id="phone"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                placeholder="(00) 00000-0000"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="mr-2">
              Cancelar
            </Button>
            <Button onClick={handleAddSupplier}>
              Adicionar Fornecedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySuppliers;
