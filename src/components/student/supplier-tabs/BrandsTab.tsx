
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash, Edit } from "lucide-react";
import { toast } from "sonner";

interface Brand {
  id: number;
  name: string;
  description: string;
}

interface BrandsTabProps {
  brands: Brand[];
  onUpdate: (brands: Brand[]) => void;
}

const BrandsTab: React.FC<BrandsTabProps> = ({ brands, onUpdate }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const handleAddBrand = () => {
    if (!newBrand.name) {
      toast.error("Nome da marca é obrigatório.");
      return;
    }

    const brand = {
      id: Date.now(),
      name: newBrand.name,
      description: newBrand.description || ""
    };

    onUpdate([...brands, brand]);
    setNewBrand({ name: "", description: "" });
    setIsAddDialogOpen(false);
    toast.success("Marca adicionada com sucesso!");
  };

  const handleEditBrand = () => {
    if (!editingBrand || !editingBrand.name) {
      toast.error("Nome da marca é obrigatório.");
      return;
    }

    const updatedBrands = brands.map(brand => 
      brand.id === editingBrand.id ? editingBrand : brand
    );

    onUpdate(updatedBrands);
    setEditingBrand(null);
    setIsEditDialogOpen(false);
    toast.success("Marca atualizada com sucesso!");
  };

  const handleDeleteBrand = (id: number) => {
    onUpdate(brands.filter(brand => brand.id !== id));
    toast.success("Marca excluída com sucesso!");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Marcas</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Marca
        </Button>
      </CardHeader>
      <CardContent>
        {brands.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma marca cadastrada. Clique no botão acima para adicionar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingBrand(brand);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir marca</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a marca {brand.name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteBrand(brand.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Brand Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Marca</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome*
              </label>
              <Input
                id="name"
                value={newBrand.name}
                onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                placeholder="Nome da marca"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Input
                id="description"
                value={newBrand.description}
                onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                placeholder="Descrição da marca"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddBrand}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Marca</DialogTitle>
          </DialogHeader>
          
          {editingBrand && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nome*
                </label>
                <Input
                  id="edit-name"
                  value={editingBrand.name}
                  onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})}
                  placeholder="Nome da marca"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Descrição
                </label>
                <Input
                  id="edit-description"
                  value={editingBrand.description}
                  onChange={(e) => setEditingBrand({...editingBrand, description: e.target.value})}
                  placeholder="Descrição da marca"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditBrand}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BrandsTab;
