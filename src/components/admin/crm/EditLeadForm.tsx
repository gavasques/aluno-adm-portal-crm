
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabel } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { CRMLead, CRMUser } from "@/types/crm.types";

interface EditLeadFormProps {
  lead: CRMLead | null;
  users: CRMUser[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EditLeadForm = React.memo(({ lead, users, onSubmit, onCancel }: EditLeadFormProps) => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      responsible_id: ""
    }
  });

  // Update form when lead changes
  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        responsible_id: lead.responsible_id || ""
      });
    }
  }, [lead, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <FormLabel htmlFor="edit-name">Nome</FormLabel>
          <Input 
            id="edit-name" 
            {...form.register('name', { required: true })} 
          />
        </div>
        
        <div className="grid gap-2">
          <FormLabel htmlFor="edit-email">Email</FormLabel>
          <Input 
            id="edit-email" 
            type="email" 
            {...form.register('email', { required: true })} 
          />
        </div>
        
        <div className="grid gap-2">
          <FormLabel htmlFor="edit-phone">Telefone</FormLabel>
          <Input 
            id="edit-phone" 
            {...form.register('phone')} 
          />
        </div>
        
        <div className="grid gap-2">
          <FormLabel htmlFor="edit-responsible">Responsável</FormLabel>
          <Select 
            onValueChange={value => form.setValue('responsible_id', value)} 
            defaultValue={lead?.responsible_id || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sem responsável</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
});

EditLeadForm.displayName = 'EditLeadForm';

export default EditLeadForm;
