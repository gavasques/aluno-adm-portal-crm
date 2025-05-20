
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash, Edit } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
}

interface ContactsTabProps {
  contacts: Contact[];
  onUpdate: (contacts: Contact[]) => void;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ contacts, onUpdate }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    role: "",
    phone: "",
    email: ""
  });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleAddContact = () => {
    if (!newContact.name) {
      toast.error("Nome do contato é obrigatório.");
      return;
    }

    const contact = {
      id: Date.now(),
      name: newContact.name,
      role: newContact.role || "",
      phone: newContact.phone || "",
      email: newContact.email || ""
    };

    onUpdate([...contacts, contact]);
    setNewContact({ name: "", role: "", phone: "", email: "" });
    setIsAddDialogOpen(false);
    toast.success("Contato adicionado com sucesso!");
  };

  const handleEditContact = () => {
    if (!editingContact || !editingContact.name) {
      toast.error("Nome do contato é obrigatório.");
      return;
    }

    const updatedContacts = contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    );

    onUpdate(updatedContacts);
    setEditingContact(null);
    setIsEditDialogOpen(false);
    toast.success("Contato atualizado com sucesso!");
  };

  const handleDeleteContact = (id: number) => {
    onUpdate(contacts.filter(contact => contact.id !== id));
    toast.success("Contato excluído com sucesso!");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contatos</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
        </Button>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum contato cadastrado. Clique no botão acima para adicionar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.role}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingContact(contact);
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
                          <AlertDialogTitle>Excluir contato</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o contato {contact.name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteContact(contact.id)}
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

      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Contato</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome*
              </label>
              <Input
                id="name"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                placeholder="Nome do contato"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Cargo
              </label>
              <Input
                id="role"
                value={newContact.role}
                onChange={(e) => setNewContact({...newContact, role: e.target.value})}
                placeholder="Cargo do contato"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddContact}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
          </DialogHeader>
          
          {editingContact && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nome*
                </label>
                <Input
                  id="edit-name"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                  placeholder="Nome do contato"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-role" className="text-sm font-medium">
                  Cargo
                </label>
                <Input
                  id="edit-role"
                  value={editingContact.role}
                  onChange={(e) => setEditingContact({...editingContact, role: e.target.value})}
                  placeholder="Cargo do contato"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-phone" className="text-sm font-medium">
                  Telefone
                </label>
                <Input
                  id="edit-phone"
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditContact}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContactsTab;
