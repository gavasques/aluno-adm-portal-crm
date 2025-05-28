
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import EditSoftwareTypeForm from "@/components/admin/EditSoftwareTypeForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useSoftwareTypes, SoftwareType } from "@/hooks/admin/useSoftwareTypes";
import { Skeleton } from "@/components/ui/skeleton";

const SoftwareTypes = () => {
  const { softwareTypes, loading, addSoftwareType, updateSoftwareType, deleteSoftwareType, updating } = useSoftwareTypes();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSoftwareType, setSelectedSoftwareType] = useState<SoftwareType | null>(null);

  const handleAddSoftwareType = async (data: { name: string; description?: string }) => {
    const success = await addSoftwareType(data);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  const handleEditSoftwareType = async (data: { name: string; description?: string }) => {
    if (selectedSoftwareType) {
      const success = await updateSoftwareType(selectedSoftwareType.id, data);
      if (success) {
        setIsEditDialogOpen(false);
        setSelectedSoftwareType(null);
      }
    }
  };

  const handleDeleteSoftwareType = async (id: string | number) => {
    await deleteSoftwareType(id.toString());
  };

  const openEditDialog = (softwareType: SoftwareType) => {
    setSelectedSoftwareType(softwareType);
    setIsEditDialogOpen(true);
  };

  // Convert to ListItem format for the table
  const listItems: ListItem[] = softwareTypes.map(type => ({
    id: type.id,
    name: type.name,
    description: type.description || "",
    created_at: type.created_at,
    updated_at: type.updated_at,
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tipos de Ferramentas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os tipos de ferramentas disponíveis no sistema
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
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
      
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Tipos de Ferramentas</span>
            <span className="text-sm font-normal text-gray-500">
              {softwareTypes.length} tipos cadastrados
            </span>
          </CardTitle>
          <CardDescription>
            Aqui você pode visualizar e gerenciar todos os tipos de ferramentas cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListTable 
            items={listItems} 
            onDelete={handleDeleteSoftwareType}
            onEdit={(item) => openEditDialog(softwareTypes.find(st => st.id === item.id)!)}
            showDescription={true}
            showDates={true}
          />
        </CardContent>
      </Card>

      {/* Edit Software Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tipo de Ferramenta</DialogTitle>
            <DialogDescription>
              Atualize as informações do tipo de ferramenta selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedSoftwareType && (
            <EditSoftwareTypeForm 
              softwareType={selectedSoftwareType}
              onSubmit={handleEditSoftwareType} 
              isLoading={updating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoftwareTypes;
