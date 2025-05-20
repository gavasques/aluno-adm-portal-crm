
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, 
  AlertDialogAction } from "@/components/ui/alert-dialog";
import { Plus, Trash } from "lucide-react";
import { Partner } from "@/hooks/usePartnersState";

interface ContactsTabProps {
  partner: Partner;
  newContactName: string;
  newContactRole: string;
  newContactEmail: string;
  newContactPhone: string;
  setNewContactName: (value: string) => void;
  setNewContactRole: (value: string) => void;
  setNewContactEmail: (value: string) => void;
  setNewContactPhone: (value: string) => void;
  handleAddContact: () => void;
  handleDeleteContact: (contactId: number) => void;
}

const ContactsTab = ({
  partner,
  newContactName,
  newContactRole,
  newContactEmail,
  newContactPhone,
  setNewContactName,
  setNewContactRole,
  setNewContactEmail,
  setNewContactPhone,
  handleAddContact,
  handleDeleteContact
}: ContactsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Contatos</span>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {partner.contacts && partner.contacts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partner.contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.role}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">
              Nenhum contato cadastrado.
            </p>
          )}
        </div>
        
        <div className="mt-6 p-4 border rounded-md">
          <h3 className="font-medium mb-4">Adicionar Novo Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <Input 
                value={newContactName} 
                onChange={(e) => setNewContactName(e.target.value)} 
                placeholder="Nome do contato" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <Input 
                value={newContactRole} 
                onChange={(e) => setNewContactRole(e.target.value)} 
                placeholder="Cargo do contato" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input 
                value={newContactEmail} 
                onChange={(e) => setNewContactEmail(e.target.value)} 
                placeholder="Email do contato" 
                type="email" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <Input 
                value={newContactPhone} 
                onChange={(e) => setNewContactPhone(e.target.value)} 
                placeholder="Telefone do contato" 
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddContact}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsTab;
