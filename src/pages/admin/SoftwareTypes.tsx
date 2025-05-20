
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const SoftwareTypes = () => {
  const [softwareTypes, setSoftwareTypes] = useState<ListItem[]>([
    { id: "1", name: "CRM", description: "Customer Relationship Management" },
    { id: "2", name: "ERP", description: "Enterprise Resource Planning" },
    { id: "3", name: "CMS", description: "Content Management System" },
    { id: "4", name: "Plataforma E-commerce", description: "Plataformas para criação de lojas virtuais" },
    { id: "5", name: "Marketing", description: "Ferramentas de marketing digital" },
    { id: "6", name: "Logística", description: "Soluções para logística e gestão de estoque" },
    { id: "7", name: "Análise de Dados", description: "Ferramentas para análise de dados e BI" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSoftwareType = (data: { name: string; description?: string }) => {
    const newType = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description || "",
    };
    setSoftwareTypes([...softwareTypes, newType]);
    setIsDialogOpen(false);
    toast.success("Tipo de ferramenta adicionado com sucesso!");
  };

  const handleDeleteSoftwareType = (id: string | number) => {
    setSoftwareTypes(softwareTypes.filter((type) => type.id !== id));
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastro de Tipos de Ferramentas</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Total: {softwareTypes.length} tipos</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo de Ferramenta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Tipo de Ferramenta</DialogTitle>
              <DialogDescription>
                Preencha as informações para adicionar um novo tipo de ferramenta ao sistema.
              </DialogDescription>
            </DialogHeader>
            <AddItemForm 
              onSubmit={handleAddSoftwareType} 
              itemName="Tipo de Ferramenta"
              showDescription={true}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Ferramentas</CardTitle>
          <CardDescription>
            Aqui você pode visualizar e gerenciar todos os tipos de ferramentas cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListTable 
            items={softwareTypes} 
            onDelete={handleDeleteSoftwareType} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SoftwareTypes;
