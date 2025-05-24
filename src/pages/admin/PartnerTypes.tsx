
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePartnerTypes } from "@/hooks/admin/usePartnerTypes";
import { Skeleton } from "@/components/ui/skeleton";

const PartnerTypes = () => {
  const { partnerTypes, loading, addPartnerType, deletePartnerType } = usePartnerTypes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPartnerType = async (data: { name: string; description?: string }) => {
    const success = await addPartnerType(data);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleDeletePartnerType = async (id: string | number) => {
    await deletePartnerType(id.toString());
  };

  // Convert to ListItem format for the table
  const listItems: ListItem[] = partnerTypes.map(type => ({
    id: type.id,
    name: type.name,
    description: type.description || "",
  }));

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastro de Tipos de Parceiros</h1>
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
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastro de Tipos de Parceiros</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Total: {partnerTypes.length} tipos</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo de Parceiro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Tipo de Parceiro</DialogTitle>
            </DialogHeader>
            <AddItemForm 
              onSubmit={handleAddPartnerType} 
              itemName="Tipo de Parceiro"
              showDescription={true}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          <ListTable 
            items={listItems} 
            onDelete={handleDeletePartnerType} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerTypes;
