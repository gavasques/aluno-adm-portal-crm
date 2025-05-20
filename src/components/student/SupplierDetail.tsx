
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BrandsTab from "./supplier-tabs/BrandsTab";
import BranchesTab from "./supplier-tabs/BranchesTab";
import ContactsTab from "./supplier-tabs/ContactsTab";
import CommunicationsTab from "./supplier-tabs/CommunicationsTab";
import FilesTab from "./supplier-tabs/FilesTab";
import ImagesTab from "./supplier-tabs/ImagesTab";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Estados brasileiros para o dropdown
const ESTADOS_BRASILEIROS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  "Outro Local"
];

// Categorias para o dropdown
const CATEGORIAS = [
  "Produtos Regionais",
  "Tecnologia",
  "Vestuário",
  "Alimentos",
  "Bebidas",
  "Eletrônicos",
  "Sustentáveis", 
  "Decoração",
  "Produtos Diversos"
];

interface SupplierDetailProps {
  supplier: any;
  onBack: () => void;
  onUpdate: (updatedSupplier: any) => void;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, onBack, onUpdate }) => {
  const [editedSupplier, setEditedSupplier] = useState({ ...supplier });
  const [activeTab, setActiveTab] = useState("dados");
  const [isEditing, setIsEditing] = useState(false);

  // Garantir que todas as propriedades necessárias existam
  if (!editedSupplier.images) editedSupplier.images = [];

  const handleSave = () => {
    // Validar campos obrigatórios
    if (!editedSupplier.name || !editedSupplier.category) {
      toast.error("Nome e categoria são campos obrigatórios.");
      return;
    }

    onUpdate(editedSupplier);
    setIsEditing(false);
    toast.success("Dados do fornecedor atualizados com sucesso!");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEditedSupplier({ ...editedSupplier, [id]: value });
  };

  // Formatar CNPJ com máscara
  const formatCNPJ = (value: string) => {
    const cnpjClean = value.replace(/\D/g, '');
    let formattedCNPJ = cnpjClean;
    
    if (cnpjClean.length > 2) formattedCNPJ = cnpjClean.substring(0, 2) + '.' + cnpjClean.substring(2);
    if (cnpjClean.length > 5) formattedCNPJ = formattedCNPJ.substring(0, 6) + '.' + cnpjClean.substring(5);
    if (cnpjClean.length > 8) formattedCNPJ = formattedCNPJ.substring(0, 10) + '/' + cnpjClean.substring(8);
    if (cnpjClean.length > 12) formattedCNPJ = formattedCNPJ.substring(0, 15) + '-' + cnpjClean.substring(12, 14);
    
    return formattedCNPJ;
  };

  // Formatar CEP com máscara
  const formatCEP = (value: string) => {
    const cepClean = value.replace(/\D/g, '');
    if (cepClean.length > 5) {
      return cepClean.substring(0, 5) + '-' + cepClean.substring(5, 8);
    }
    return cepClean;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold text-portal-dark">{editedSupplier.name}</h1>
        {!isEditing && (
          <Button 
            className="ml-auto" 
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Editar Fornecedor
          </Button>
        )}
        {isEditing && (
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setEditedSupplier({ ...supplier });
                setIsEditing(false);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="marcas">Marcas</TabsTrigger>
          <TabsTrigger value="filiais">Filiais</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Fornecedor</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
                    <Input
                      id="name"
                      value={editedSupplier.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria*</label>
                    <select
                      id="category"
                      value={editedSupplier.category}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                    >
                      {CATEGORIAS.map(categoria => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <Input
                      id="cnpj"
                      value={editedSupplier.cnpj}
                      onChange={(e) => {
                        // Formatar o CNPJ
                        const formattedValue = formatCNPJ(e.target.value);
                        setEditedSupplier({ ...editedSupplier, cnpj: formattedValue });
                      }}
                      disabled={!isEditing}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      id="type"
                      value={editedSupplier.type}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                    >
                      <option value="Distribuidor">Distribuidor</option>
                      <option value="Fabricante">Fabricante</option>
                      <option value="Importador">Importador</option>
                      <option value="Atacadista">Atacadista</option>
                      <option value="Varejista">Varejista</option>
                      <option value="Representante">Representante</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <Input
                      id="address"
                      value={editedSupplier.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Rua, número, bairro - cidade/estado"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <Input
                      id="email"
                      type="email"
                      value={editedSupplier.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <Input
                      id="phone"
                      value={editedSupplier.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <Input
                      id="website"
                      value={editedSupplier.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="www.example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      id="status"
                      value={editedSupplier.isActive ? "true" : "false"}
                      onChange={(e) => {
                        setEditedSupplier({ 
                          ...editedSupplier, 
                          isActive: e.target.value === "true"
                        });
                      }}
                      disabled={!isEditing}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marcas">
          <Card>
            <CardHeader>
              <CardTitle>Marcas</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="flex flex-wrap gap-2">
                  {editedSupplier.brands && editedSupplier.brands.length > 0 ? (
                    editedSupplier.brands.map((brand) => (
                      <Badge key={brand.id} variant="secondary" className="text-sm py-2">
                        {brand.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhuma marca cadastrada.</p>
                  )}
                </div>
                
                {isEditing && (
                  <BrandsTab 
                    brands={editedSupplier.brands}
                    onUpdate={(updatedBrands) => {
                      setEditedSupplier({ ...editedSupplier, brands: updatedBrands });
                    }}
                  />
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filiais">
          <BranchesTab 
            branches={editedSupplier.branches}
            onUpdate={(updatedBranches) => {
              setEditedSupplier({ ...editedSupplier, branches: updatedBranches });
            }}
            isEditing={isEditing}
            states={ESTADOS_BRASILEIROS}
          />
        </TabsContent>

        <TabsContent value="contatos">
          <ContactsTab 
            contacts={editedSupplier.contacts}
            onUpdate={(updatedContacts) => {
              setEditedSupplier({ ...editedSupplier, contacts: updatedContacts });
            }}
            isEditing={isEditing}
          />
        </TabsContent>

        <TabsContent value="comunicacao">
          <CommunicationsTab 
            communications={editedSupplier.communications}
            onUpdate={(updatedCommunications) => {
              setEditedSupplier({ ...editedSupplier, communications: updatedCommunications });
            }}
            isEditing={isEditing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetail;
