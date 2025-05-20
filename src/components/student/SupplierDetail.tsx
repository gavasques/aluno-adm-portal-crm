
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import BrandsTab from "./supplier-tabs/BrandsTab";
import BranchesTab from "./supplier-tabs/BranchesTab";
import ContactsTab from "./supplier-tabs/ContactsTab";
import CommunicationsTab from "./supplier-tabs/CommunicationsTab";
import FilesTab from "./supplier-tabs/FilesTab";

interface SupplierDetailProps {
  supplier: any;
  onBack: () => void;
  onUpdate: (updatedSupplier: any) => void;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, onBack, onUpdate }) => {
  const [editedSupplier, setEditedSupplier] = useState({ ...supplier });
  const [activeTab, setActiveTab] = useState("dados");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Validate required fields
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
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="marcas">Marcas</TabsTrigger>
          <TabsTrigger value="filiais">Filiais</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
          <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Fornecedor</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <Input
                    id="category"
                    value={editedSupplier.category}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <Input
                    id="cnpj"
                    value={editedSupplier.cnpj}
                    onChange={handleInputChange}
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marcas">
          <BrandsTab 
            brands={editedSupplier.brands}
            onUpdate={(updatedBrands) => {
              setEditedSupplier({ ...editedSupplier, brands: updatedBrands });
            }}
          />
        </TabsContent>

        <TabsContent value="filiais">
          <BranchesTab 
            branches={editedSupplier.branches}
            onUpdate={(updatedBranches) => {
              setEditedSupplier({ ...editedSupplier, branches: updatedBranches });
            }}
          />
        </TabsContent>

        <TabsContent value="contatos">
          <ContactsTab 
            contacts={editedSupplier.contacts}
            onUpdate={(updatedContacts) => {
              setEditedSupplier({ ...editedSupplier, contacts: updatedContacts });
            }}
          />
        </TabsContent>

        <TabsContent value="comunicacao">
          <CommunicationsTab 
            communications={editedSupplier.communications}
            onUpdate={(updatedCommunications) => {
              setEditedSupplier({ ...editedSupplier, communications: updatedCommunications });
            }}
          />
        </TabsContent>

        <TabsContent value="arquivos">
          <FilesTab 
            files={editedSupplier.files}
            onUpdate={(updatedFiles) => {
              setEditedSupplier({ ...editedSupplier, files: updatedFiles });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetail;
