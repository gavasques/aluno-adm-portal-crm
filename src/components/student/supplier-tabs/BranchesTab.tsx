
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash, Edit } from "lucide-react";
import { toast } from "sonner";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface BranchesTabProps {
  branches: Branch[];
  onUpdate: (branches: Branch[]) => void;
}

const BranchesTab: React.FC<BranchesTabProps> = ({ branches, onUpdate }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({ 
    name: "", 
    address: "", 
    phone: "",
    email: "" 
  });
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleAddBranch = () => {
    if (!newBranch.name) {
      toast.error("Nome da filial é obrigatório.");
      return;
    }

    const branch = {
      id: Date.now(),
      name: newBranch.name,
      address: newBranch.address || "",
      phone: newBranch.phone || "",
      email: newBranch.email || ""
    };

    onUpdate([...branches, branch]);
    setNewBranch({ name: "", address: "", phone: "", email: "" });
    setIsAddDialogOpen(false);
    toast.success("Filial adicionada com sucesso!");
  };

  const handleEditBranch = () => {
    if (!editingBranch || !editingBranch.name) {
      toast.error("Nome da filial é obrigatório.");
      return;
    }

    const updatedBranches = branches.map(branch => 
      branch.id === editingBranch.id ? editingBranch : branch
    );

    onUpdate(updatedBranches);
    setEditingBranch(null);
    setIsEditDialogOpen(false);
    toast.success("Filial atualizada com sucesso!");
  };

  const handleDeleteBranch = (id: number) => {
    onUpdate(branches.filter(branch => branch.id !== id));
    toast.success("Filial excluída com sucesso!");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filiais</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Filial
        </Button>
      </CardHeader>
      <CardContent>
        {branches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma filial cadastrada. Clique no botão acima para adicionar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone}</TableCell>
                  <TableCell>{branch.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingBranch(branch);
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
                          <AlertDialogTitle>Excluir filial</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a filial {branch.name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteBranch(branch.id)}
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

      {/* Add Branch Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Filial</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome*
              </label>
              <Input
                id="name"
                value={newBranch.name}
                onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                placeholder="Nome da filial"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="address" className="text-sm font-medium">
                Endereço
              </label>
              <Input
                id="address"
                value={newBranch.address}
                onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                placeholder="Rua, número, bairro - cidade/estado"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </label>
              <Input
                id="phone"
                value={newBranch.phone}
                onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                placeholder="(00) 0000-0000"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={newBranch.email}
                onChange={(e) => setNewBranch({...newBranch, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddBranch}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Filial</DialogTitle>
          </DialogHeader>
          
          {editingBranch && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nome*
                </label>
                <Input
                  id="edit-name"
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({...editingBranch, name: e.target.value})}
                  placeholder="Nome da filial"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-address" className="text-sm font-medium">
                  Endereço
                </label>
                <Input
                  id="edit-address"
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({...editingBranch, address: e.target.value})}
                  placeholder="Rua, número, bairro - cidade/estado"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-phone" className="text-sm font-medium">
                  Telefone
                </label>
                <Input
                  id="edit-phone"
                  value={editingBranch.phone}
                  onChange={(e) => setEditingBranch({...editingBranch, phone: e.target.value})}
                  placeholder="(00) 0000-0000"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingBranch.email}
                  onChange={(e) => setEditingBranch({...editingBranch, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditBranch}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BranchesTab;
