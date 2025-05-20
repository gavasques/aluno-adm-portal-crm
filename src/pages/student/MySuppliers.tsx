
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Users, Star, MessageCircle, Trash } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import SupplierDetail from "@/components/student/SupplierDetail";

// Sample data for my suppliers
const INITIAL_SUPPLIERS = [
  {
    id: 1,
    name: "Meu Fornecedor Local",
    category: "Produtos Regionais",
    rating: 4.5,
    comments: 3,
    logo: "ML",
    cnpj: "12.345.678/0001-90",
    email: "contato@meufornecedor.com",
    phone: "(11) 98765-4321",
    website: "www.meufornecedor.com",
    address: "Av. Exemplo, 1000 - São Paulo/SP",
    type: "Distribuidor",
    brands: [
      { id: 1, name: "Marca Regional", description: "Produtos locais" }
    ],
    branches: [
      { id: 1, name: "Filial SP Centro", address: "Rua Central, 123 - São Paulo/SP", phone: "(11) 3456-7890", email: "centro@meufornecedor.com" }
    ],
    contacts: [
      { id: 1, name: "João Silva", role: "Gerente Comercial", phone: "(11) 97654-3210", email: "joao@meufornecedor.com" }
    ],
    communications: [
      { id: 1, date: "2023-05-15", type: "Reunião", notes: "Discutimos novos produtos", contact: "João Silva" }
    ],
    files: [
      { id: 1, name: "Catálogo 2023", type: "PDF", size: "2.5MB", date: "2023-04-10" }
    ]
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
    phone: "",
    website: "",
    cnpj: "",
    address: "",
    type: "Distribuidor"
  });
  
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  
  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddSupplier = () => {
    // Validate form
    if (!newSupplier.name || !newSupplier.category) {
      toast.error("Por favor, preencha nome e categoria do fornecedor.");
      return;
    }
    
    // Create new supplier with all required properties
    const supplier = {
      id: Date.now(),
      name: newSupplier.name,
      category: newSupplier.category,
      email: newSupplier.email || "",
      phone: newSupplier.phone || "",
      website: newSupplier.website || "",
      cnpj: newSupplier.cnpj || "",
      address: newSupplier.address || "",
      type: newSupplier.type || "Distribuidor",
      rating: 0,
      comments: 0,
      logo: newSupplier.name.substring(0, 2).toUpperCase(),
      brands: [],
      branches: [],
      contacts: [],
      communications: [],
      files: []
    };
    
    setSuppliers([...suppliers, supplier]);
    toast.success(`${newSupplier.name} foi adicionado com sucesso.`);
    
    // Reset form and close dialog
    setNewSupplier({
      name: "",
      category: "",
      contact: "",
      email: "",
      phone: "",
      website: "",
      cnpj: "",
      address: "",
      type: "Distribuidor"
    });
    
    setIsAddDialogOpen(false);
  };
  
  const handleDeleteSupplier = (id) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast.success("Fornecedor excluído com sucesso.");
  };

  const handleUpdateSupplier = (updatedSupplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    ));
    setSelectedSupplier(updatedSupplier);
    toast.success("Fornecedor atualizado com sucesso!");
  };
  
  return (
    <div className="container mx-auto py-6">
      {!selectedSupplier ? (
        <>
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
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      Gerenciar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir fornecedor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir {supplier.name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
        </>
      ) : (
        <SupplierDetail 
          supplier={selectedSupplier} 
          onBack={() => setSelectedSupplier(null)}
          onUpdate={handleUpdateSupplier}
        />
      )}
      
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
              <label htmlFor="cnpj" className="text-right font-medium">
                CNPJ
              </label>
              <Input
                id="cnpj"
                value={newSupplier.cnpj}
                onChange={(e) => setNewSupplier({...newSupplier, cnpj: e.target.value})}
                placeholder="00.000.000/0000-00"
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="website" className="text-right font-medium">
                Website
              </label>
              <Input
                id="website"
                value={newSupplier.website}
                onChange={(e) => setNewSupplier({...newSupplier, website: e.target.value})}
                placeholder="www.example.com"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right font-medium">
                Endereço
              </label>
              <Input
                id="address"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                placeholder="Rua, número, bairro - cidade/estado"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right font-medium">
                Tipo
              </label>
              <select
                id="type"
                value={newSupplier.type}
                onChange={(e) => setNewSupplier({...newSupplier, type: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Distribuidor">Distribuidor</option>
                <option value="Fabricante">Fabricante</option>
                <option value="Importador">Importador</option>
                <option value="Atacadista">Atacadista</option>
                <option value="Varejista">Varejista</option>
                <option value="Representante">Representante</option>
              </select>
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
