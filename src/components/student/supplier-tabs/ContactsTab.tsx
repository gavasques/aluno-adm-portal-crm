
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Contact {
  id: number;
  name: string;
  role?: string;
  phone?: string;
  phone2?: string;
  whatsapp?: string; 
  email?: string;
  email2?: string;
  observacao?: string;
}

interface ContactsTabProps {
  contacts: Contact[];
  onUpdate: (contacts: Contact[]) => void;
  isEditing?: boolean;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ 
  contacts = [], 
  onUpdate,
  isEditing = true
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  
  const [newContact, setNewContact] = useState<Contact>({
    id: Date.now(),
    name: "",
    role: "",
    phone: "",
    phone2: "",
    whatsapp: "",
    email: "",
    email2: "",
    observacao: ""
  });

  const resetNewContact = () => {
    setNewContact({
      id: Date.now(),
      name: "",
      role: "",
      phone: "",
      phone2: "",
      whatsapp: "",
      email: "",
      email2: "",
      observacao: ""
    });
  };

  const handleAddContact = () => {
    if (!newContact.name) {
      toast.error("O nome do contato é obrigatório!");
      return;
    }

    onUpdate([...contacts, { ...newContact, id: Date.now() }]);
    toast.success("Contato adicionado com sucesso!");
    resetNewContact();
    setIsAddDialogOpen(false);
  };

  const handleEditContact = () => {
    if (!currentContact || !currentContact.name) {
      toast.error("O nome do contato é obrigatório!");
      return;
    }

    onUpdate(contacts.map(contact => contact.id === currentContact.id ? currentContact : contact));
    toast.success("Contato atualizado com sucesso!");
    setCurrentContact(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteContact = (id: number | string) => {
    onUpdate(contacts.filter(contact => contact.id !== id));
  };

  const handleViewContact = (id: number | string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      setCurrentContact({ ...contact });
      setIsEditDialogOpen(true);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contatos</CardTitle>
        {isEditing && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {contacts.length > 0 ? (
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Nome</th>
                  <th className="py-3 px-4 text-left font-medium">Cargo</th>
                  <th className="py-3 px-4 text-left font-medium">Telefone</th>
                  <th className="py-3 px-4 text-left font-medium">E-mail</th>
                  <th className="py-3 px-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-t">
                    <td className="py-3 px-4">{contact.name}</td>
                    <td className="py-3 px-4">{contact.role || '-'}</td>
                    <td className="py-3 px-4">{contact.phone || '-'}</td>
                    <td className="py-3 px-4">{contact.email || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewContact(contact.id)}
                        >
                          {isEditing ? 'Editar' : 'Visualizar'}
                        </Button>
                        
                        {isEditing && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-500">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir contato</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o contato "{contact.name}"? Esta ação não pode ser desfeita.
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
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhum contato cadastrado.
          </p>
        )}

        {/* Add Contact Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Contato</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome*</label>
                <Input 
                  value={newContact.name} 
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} 
                  placeholder="Nome do contato" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargo</label>
                <Input 
                  value={newContact.role || ''} 
                  onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                  placeholder="Cargo do contato" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <Input 
                  value={newContact.phone || ''} 
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="(00) 00000-0000" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone 2</label>
                <Input 
                  value={newContact.phone2 || ''} 
                  onChange={(e) => setNewContact({ ...newContact, phone2: e.target.value })}
                  placeholder="(00) 00000-0000" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp</label>
                <Input 
                  value={newContact.whatsapp || ''} 
                  onChange={(e) => setNewContact({ ...newContact, whatsapp: e.target.value })}
                  placeholder="(00) 00000-0000" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input 
                  value={newContact.email || ''} 
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="email@exemplo.com" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail 2</label>
                <Input 
                  value={newContact.email2 || ''} 
                  onChange={(e) => setNewContact({ ...newContact, email2: e.target.value })}
                  placeholder="email2@exemplo.com" 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Observação</label>
                <Textarea 
                  value={newContact.observacao || ''} 
                  onChange={(e) => setNewContact({ ...newContact, observacao: e.target.value })}
                  placeholder="Observações sobre o contato" 
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  resetNewContact();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddContact}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar' : 'Visualizar'} Contato</DialogTitle>
            </DialogHeader>
            
            {currentContact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome*</label>
                  <Input 
                    value={currentContact.name} 
                    onChange={(e) => setCurrentContact({ ...currentContact, name: e.target.value })} 
                    placeholder="Nome do contato" 
                    required
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cargo</label>
                  <Input 
                    value={currentContact.role || ''} 
                    onChange={(e) => setCurrentContact({ ...currentContact, role: e.target.value })}
                    placeholder="Cargo do contato" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input 
                    value={currentContact.phone || ''} 
                    onChange={(e) => setCurrentContact({ ...currentContact, phone: e.target.value })}
                    placeholder="(00) 00000-0000" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone 2</label>
                  <Input 
                    value={currentContact.phone2 || ''} 
                    onChange={(e) => setCurrentContact({ ...currentContact, phone2: e.target.value })}
                    placeholder="(00) 00000-0000" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">WhatsApp</label>
                  <Input 
                    value={currentContact.whatsapp || ''} 
                    onChange={(e) => setCurrentContact({ ...currentContact, whatsapp: e.target.value })}
                    placeholder="(00) 00000-0000" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input 
                    value={currentContact.email || ''} 
                    onChange={(e) => setCurrentContact({ ...currentContact, email: e.target.value })}
                    placeholder="email@exemplo.com" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail 2</label>
                  <Input 
                    value={currentContact.email2 || ''} 
                    onChange={(e) => setCurrentContact({ ...currentContact, email2: e.target.value })}
                    placeholder="email2@exemplo.com" 
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Observação</label>
                  <Textarea 
                    value={currentContact.observacao || ''} 
                    onChange={(e) => setCurrentContact({ ...currentContact, observacao: e.target.value })}
                    placeholder="Observações sobre o contato" 
                    rows={3}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentContact(null);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              {isEditing && (
                <Button onClick={handleEditContact}>Salvar Alterações</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContactsTab;
