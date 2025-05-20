
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PartnerTypes = () => {
  const [partnerTypes, setPartnerTypes] = useState<ListItem[]>([
    { id: "1", name: "Agência", description: "Agência de marketing ou desenvolvimento" },
    { id: "2", name: "Consultor", description: "Consultores independentes" },
    { id: "3", name: "Revenda", description: "Revenda de produtos e serviços" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPartnerType = (data: { name: string; description?: string }) => {
    const newType = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description || "",
    };
    setPartnerTypes([...partnerTypes, newType]);
    setIsDialogOpen(false);
  };

  const handleDeletePartnerType = (id: string | number) => {
    setPartnerTypes(partnerTypes.filter((type) => type.id !== id));
  };

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
            items={partnerTypes} 
            onDelete={handleDeletePartnerType} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerTypes;
