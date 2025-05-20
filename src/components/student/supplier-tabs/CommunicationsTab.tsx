
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash, Edit } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Communication {
  id: number;
  date: string;
  type: string;
  notes: string;
  contact: string;
}

interface CommunicationsTabProps {
  communications: Communication[];
  onUpdate: (communications: Communication[]) => void;
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({ communications, onUpdate }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: "",
    notes: "",
    contact: ""
  });
  const [editingCommunication, setEditingCommunication] = useState<Communication | null>(null);

  const handleAddCommunication = () => {
    if (!newCommunication.type) {
      toast.error("Tipo de comunicação é obrigatório.");
      return;
    }

    const communication = {
      id: Date.now(),
      date: newCommunication.date,
      type: newCommunication.type,
      notes: newCommunication.notes || "",
      contact: newCommunication.contact || ""
    };

    onUpdate([...communications, communication]);
    setNewCommunication({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: "",
      notes: "",
      contact: ""
    });
    setIsAddDialogOpen(false);
    toast.success("Comunicação registrada com sucesso!");
  };

  const handleEditCommunication = () => {
    if (!editingCommunication || !editingCommunication.type) {
      toast.error("Tipo de comunicação é obrigatório.");
      return;
    }

    const updatedCommunications = communications.map(communication => 
      communication.id === editingCommunication.id ? editingCommunication : communication
    );

    onUpdate(updatedCommunications);
    setEditingCommunication(null);
    setIsEditDialogOpen(false);
    toast.success("Comunicação atualizada com sucesso!");
  };

  const handleDeleteCommunication = (id: number) => {
    onUpdate(communications.filter(communication => communication.id !== id));
    toast.success("Comunicação excluída com sucesso!");
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registros de Comunicação</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Comunicação
        </Button>
      </CardHeader>
      <CardContent>
        {communications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma comunicação registrada. Clique no botão acima para adicionar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.map((communication) => (
                <TableRow key={communication.id}>
                  <TableCell>{formatDisplayDate(communication.date)}</TableCell>
                  <TableCell>{communication.type}</TableCell>
                  <TableCell>{communication.contact}</TableCell>
                  <TableCell>{communication.notes}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingCommunication(communication);
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
                          <AlertDialogTitle>Excluir comunicação</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este registro de comunicação? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteCommunication(communication.id)}
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

      {/* Add Communication Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Comunicação</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Data
              </label>
              <Input
                id="date"
                type="date"
                value={newCommunication.date}
                onChange={(e) => setNewCommunication({...newCommunication, date: e.target.value})}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Tipo*
              </label>
              <select
                id="type"
                value={newCommunication.type}
                onChange={(e) => setNewCommunication({...newCommunication, type: e.target.value})}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="Reunião">Reunião</option>
                <option value="Ligação">Ligação</option>
                <option value="E-mail">E-mail</option>
                <option value="Visita">Visita</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="contact" className="text-sm font-medium">
                Contato
              </label>
              <Input
                id="contact"
                value={newCommunication.contact}
                onChange={(e) => setNewCommunication({...newCommunication, contact: e.target.value})}
                placeholder="Nome do contato"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Observações
              </label>
              <textarea
                id="notes"
                value={newCommunication.notes}
                onChange={(e) => setNewCommunication({...newCommunication, notes: e.target.value})}
                placeholder="Detalhes da comunicação"
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCommunication}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Communication Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Comunicação</DialogTitle>
          </DialogHeader>
          
          {editingCommunication && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-date" className="text-sm font-medium">
                  Data
                </label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingCommunication.date}
                  onChange={(e) => setEditingCommunication({...editingCommunication, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-type" className="text-sm font-medium">
                  Tipo*
                </label>
                <select
                  id="edit-type"
                  value={editingCommunication.type}
                  onChange={(e) => setEditingCommunication({...editingCommunication, type: e.target.value})}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                  required
                >
                  <option value="">Selecione um tipo</option>
                  <option value="Reunião">Reunião</option>
                  <option value="Ligação">Ligação</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Visita">Visita</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-contact" className="text-sm font-medium">
                  Contato
                </label>
                <Input
                  id="edit-contact"
                  value={editingCommunication.contact}
                  onChange={(e) => setEditingCommunication({...editingCommunication, contact: e.target.value})}
                  placeholder="Nome do contato"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-notes" className="text-sm font-medium">
                  Observações
                </label>
                <textarea
                  id="edit-notes"
                  value={editingCommunication.notes}
                  onChange={(e) => setEditingCommunication({...editingCommunication, notes: e.target.value})}
                  placeholder="Detalhes da comunicação"
                  className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCommunication}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CommunicationsTab;
