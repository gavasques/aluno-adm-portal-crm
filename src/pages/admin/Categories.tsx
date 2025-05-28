
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useCategories } from "@/hooks/useCategories";
import { Toaster } from "@/components/ui/toaster";

const Categories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    categories, 
    isLoading, 
    error, 
    createCategory, 
    deleteCategory,
    isCreating 
  } = useCategories();

  const handleAddCategory = (data: { name: string; description?: string }) => {
    createCategory(data);
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (id: string | number) => {
    deleteCategory(String(id));
  };

  // Convert to ListItem format for the table
  const listItems: ListItem[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || "",
    created_at: category.created_at,
    updated_at: category.updated_at,
  }));

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Erro ao carregar categorias</div>
          <div className="text-gray-400 text-sm">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </div>
        </div>
      </div>
    );
  }

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
            <Button className="flex items-center gap-2" disabled={isCreating}>
              <Plus className="h-4 w-4" />
              {isCreating ? 'Criando...' : 'Nova Categoria'}
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
              {isLoading ? 'Carregando...' : `${categories.length} categorias cadastradas`}
            </span>
          </CardTitle>
          <CardDescription>
            Aqui você pode visualizar e gerenciar todas as categorias cadastradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando categorias...</p>
            </div>
          ) : (
            <ListTable 
              items={listItems} 
              onDelete={handleDeleteCategory}
              showDescription={true}
              showDates={true}
            />
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default Categories;
