
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useSoftwareTypes } from "@/hooks/admin/useSoftwareTypes";
import { Skeleton } from "@/components/ui/skeleton";

const SoftwareTypes = () => {
  const { softwareTypes, loading, addSoftwareType, deleteSoftwareType } = useSoftwareTypes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSoftwareType = async (data: { name: string; description?: string }) => {
    const success = await addSoftwareType(data);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleDeleteSoftwareType = async (id: string | number) => {
    await deleteSoftwareType(id.toString());
  };

  // Convert to ListItem format for the table
  const listItems: ListItem[] = softwareTypes.map(type => ({
    id: type.id,
    name: type.name,
    description: type.description || "",
  }));

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastro de Tipos de Ferramentas</h1>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

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
            items={listItems} 
            onDelete={handleDeleteSoftwareType} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SoftwareTypes;
