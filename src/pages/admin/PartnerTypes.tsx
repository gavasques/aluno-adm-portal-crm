
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import EditPartnerTypeForm from "@/components/admin/EditPartnerTypeForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { usePartnerTypes, PartnerType } from "@/hooks/admin/usePartnerTypes";
import { Skeleton } from "@/components/ui/skeleton";

const PartnerTypes = () => {
  const { partnerTypes, loading, addPartnerType, updatePartnerType, deletePartnerType, updating } = usePartnerTypes();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPartnerType, setSelectedPartnerType] = useState<PartnerType | null>(null);

  const handleAddPartnerType = async (data: { name: string; description?: string }) => {
    const success = await addPartnerType(data);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  const handleEditPartnerType = async (data: { name: string; description?: string }) => {
    if (selectedPartnerType) {
      const success = await updatePartnerType(selectedPartnerType.id, data);
      if (success) {
        setIsEditDialogOpen(false);
        setSelectedPartnerType(null);
      }
    }
  };

  const handleDeletePartnerType = async (id: string | number) => {
    await deletePartnerType(id.toString());
  };

  const openEditDialog = (partnerType: PartnerType) => {
    setSelectedPartnerType(partnerType);
    setIsEditDialogOpen(true);
  };

  // Convert to ListItem format for the table
  const listItems: ListItem[] = partnerTypes.map(type => ({
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
          <h1 className="text-2xl font-bold text-gray-900">Tipos de Parceiros</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os tipos de parceiros disponíveis no sistema
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Tipo de Parceiro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Tipo de Parceiro</DialogTitle>
              <DialogDescription>
                Preencha as informações para adicionar um novo tipo de parceiro ao sistema.
              </DialogDescription>
            </DialogHeader>
            <AddItemForm 
              onSubmit={handleAddPartnerType} 
              itemName="Tipo de Parceiro"
              showDescription={true}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Tipos de Parceiros</span>
            <span className="text-sm font-normal text-gray-500">
              {partnerTypes.length} tipos cadastrados
            </span>
          </CardTitle>
          <CardDescription>
            Aqui você pode visualizar e gerenciar todos os tipos de parceiros cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListTable 
            items={listItems} 
            onDelete={handleDeletePartnerType}
            onEdit={(item) => openEditDialog(partnerTypes.find(pt => pt.id === item.id)!)}
            showDescription={true}
            showDates={true}
          />
        </CardContent>
      </Card>

      {/* Edit Partner Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tipo de Parceiro</DialogTitle>
            <DialogDescription>
              Atualize as informações do tipo de parceiro selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedPartnerType && (
            <EditPartnerTypeForm 
              partnerType={selectedPartnerType}
              onSubmit={handleEditPartnerType} 
              isLoading={updating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerTypes;
