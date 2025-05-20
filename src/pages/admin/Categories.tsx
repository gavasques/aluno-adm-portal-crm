
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Categories = () => {
  const [categories, setCategories] = useState<ListItem[]>([
    { id: "1", name: "E-commerce" },
    { id: "2", name: "Marketing Digital" },
    { id: "3", name: "Gestão Financeira" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCategory = (data: { name: string }) => {
    const newCategory = {
      id: Date.now().toString(),
      name: data.name,
    };
    setCategories([...categories, newCategory]);
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (id: string | number) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastro de Categorias</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Total: {categories.length} categorias</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            </DialogHeader>
            <AddItemForm 
              onSubmit={handleAddCategory} 
              itemName="Categoria"
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <ListTable 
            items={categories} 
            onDelete={handleDeleteCategory} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
