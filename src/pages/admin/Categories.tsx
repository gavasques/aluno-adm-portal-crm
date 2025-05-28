
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

// Mock data para demonstração
const MOCK_CATEGORIES = [
  { id: 1, name: "E-commerce", description: "Categoria para produtos de e-commerce" },
  { id: 2, name: "Tecnologia", description: "Categoria para produtos tecnológicos" },
  { id: 3, name: "Marketing", description: "Categoria para serviços de marketing" },
  { id: 4, name: "Vestuário", description: "Categoria para roupas e acessórios" },
  { id: 5, name: "Casa e Jardim", description: "Categoria para produtos domésticos" }
];

const Categories = () => {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCategory = (data: { name: string; description?: string }) => {
    const newCategory = {
      id: categories.length + 1,
      name: data.name,
      description: data.description || "",
    };
    setCategories([...categories, newCategory]);
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (id: string | number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // Convert to ListItem format for the table
  const listItems: ListItem[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as categorias disponíveis no sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Preencha as informações para adicionar uma nova categoria ao sistema.
              </DialogDescription>
            </DialogHeader>
            <AddItemForm 
              onSubmit={handleAddCategory} 
              itemName="Categoria"
              showDescription={true}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Categorias</span>
            <span className="text-sm font-normal text-gray-500">
              {categories.length} categorias cadastradas
            </span>
          </CardTitle>
          <CardDescription>
            Aqui você pode visualizar e gerenciar todas as categorias cadastradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListTable 
            items={listItems} 
            onDelete={handleDeleteCategory}
            showDescription={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
