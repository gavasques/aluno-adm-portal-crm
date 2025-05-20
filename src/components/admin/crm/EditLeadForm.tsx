
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabel } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Lead, Administrator } from "@/hooks/useCRMState";

interface EditLeadFormProps {
  lead: Lead | null;
  administrators: Administrator[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EditLeadForm = ({ lead, administrators, onSubmit, onCancel }: EditLeadFormProps) => {
  const form = useForm({
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      responsible: ""
    }
  });

  // Update form when lead changes
  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        responsible: lead.responsible
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
          <FormLabel htmlFor="edit-company">Empresa</FormLabel>
          <Input 
            id="edit-company" 
            {...form.register('company', { required: true })} 
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
            onValueChange={value => form.setValue('responsible', value)} 
            defaultValue={lead?.responsible || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              {administrators.map(admin => (
                <SelectItem key={admin.id} value={admin.name}>
                  {admin.name}
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
};

export default EditLeadForm;
