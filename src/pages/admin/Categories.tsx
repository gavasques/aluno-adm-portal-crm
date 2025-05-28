
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import EditCategoryForm from "@/components/admin/EditCategoryForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useCategories, Category } from "@/hooks/useCategories";
import { Toaster } from "@/components/ui/toaster";

const Categories = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const { 
    categories, 
    isLoading, 
    error, 
    createCategory, 
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating
  } = useCategories();

  const handleAddCategory = (data: { name: string; description?: string }) => {
    createCategory(data);
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = (data: { name: string; description?: string }) => {
    if (selectedCategory) {
      updateCategory(selectedCategory.id, data);
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleDeleteCategory = (id: string | number) => {
    deleteCategory(String(id));
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              onEdit={(item) => openEditDialog(categories.find(c => c.id === item.id)!)}
              showDescription={true}
              showDates={true}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Atualize as informações da categoria selecionada.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <EditCategoryForm 
              category={selectedCategory}
              onSubmit={handleEditCategory} 
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default Categories;
