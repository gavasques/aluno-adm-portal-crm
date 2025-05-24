
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListTable, { ListItem } from "@/components/admin/ListTable";
import AddItemForm from "@/components/admin/AddItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Categories = () => {
  const [categories, setCategories] = useState<ListItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar categorias do Supabase
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar categorias');
        return;
      }

      const formattedCategories = data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  // Carregar categorias ao montar o componente
  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (data: { name: string; description?: string }) => {
    try {
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert([
          {
            name: data.name,
            description: data.description || null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar categoria:', error);
        toast.error('Erro ao adicionar categoria');
        return;
      }

      const formattedCategory = {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description
      };

      setCategories([...categories, formattedCategory]);
      setIsDialogOpen(false);
      toast.success('Categoria adicionada com sucesso!');
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao adicionar categoria');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir categoria:', error);
        toast.error('Erro ao excluir categoria');
        return;
      }

      setCategories(categories.filter((category) => category.id !== id));
      toast.success('Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao excluir categoria');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastro de Categorias</h1>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">Carregando categorias...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              showDescription={true}
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
