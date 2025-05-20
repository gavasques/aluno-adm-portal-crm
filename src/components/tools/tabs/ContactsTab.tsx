
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Tool } from "../ToolsTable";

interface ContactsTabProps {
  tool: Tool;
  onUpdateTool: (updatedTool: Tool) => void;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ tool, onUpdateTool }) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = React.useState(false);
  
  const contactForm = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        role: z.string().min(2, "Função é obrigatória"),
        email: z.string().email("E-mail inválido"),
        phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
        notes: z.string().optional(),
      })
    ),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      notes: "",
    }
  });
  
  const handleAddContact = (data) => {
    const newContact = {
      id: Date.now(),
      ...data
    };
    
    const updatedTool = {
      ...tool,
      contacts: [...tool.contacts, newContact]
    };
    
    onUpdateTool(updatedTool);
    toast.success("Contato adicionado com sucesso!");
    contactForm.reset();
    setIsContactDialogOpen(false);
  };
  
  return (
    <>
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Contatos</h3>
            <Button size="sm" onClick={() => setIsContactDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1" /> Adicionar Contato
            </Button>
          </div>
          
          {tool.contacts && tool.contacts.length > 0 ? (
            <div className="space-y-4">
              {tool.contacts.map((contact) => (
                <div key={contact.id} className="border p-4 rounded-md">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-lg">{contact.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Função</p>
                      <p>{contact.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{contact.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p>{contact.phone}</p>
                    </div>
                  </div>
                  {contact.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Observações</p>
                      <p className="text-sm mt-1">{contact.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Nenhum contato cadastrado.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Contato</DialogTitle>
            <DialogDescription>
              Adicione informações detalhadas do contato.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={contactForm.handleSubmit(handleAddContact)}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome*</Label>
                <Input
                  id="name"
                  placeholder="Nome completo"
                  {...contactForm.register("name")}
                />
                {contactForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{contactForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função*</Label>
                <Input
                  id="role"
                  placeholder="Ex: Gestor de Contas, Suporte, etc."
                  {...contactForm.register("role")}
                />
                {contactForm.formState.errors.role && (
                  <p className="text-sm text-red-500">{contactForm.formState.errors.role.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  placeholder="email@exemplo.com"
                  type="email"
                  {...contactForm.register("email")}
                />
                {contactForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{contactForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone*</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  {...contactForm.register("phone")}
                />
                {contactForm.formState.errors.phone && (
                  <p className="text-sm text-red-500">{contactForm.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Informações adicionais sobre o contato"
                  {...contactForm.register("notes")}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactsTab;
