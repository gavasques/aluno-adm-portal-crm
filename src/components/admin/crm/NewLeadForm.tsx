
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabel } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";

interface Administrator {
  id: number;
  name: string;
}

interface NewLeadFormProps {
  administrators: Administrator[];
  onSubmit: (data: any) => void;
}

const NewLeadForm = ({ administrators, onSubmit }: NewLeadFormProps) => {
  const form = useForm({
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      responsible: ""
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <FormLabel htmlFor="name">Nome</FormLabel>
          <Input 
            id="name" 
            {...form.register('name', { required: true })} 
            placeholder="Nome do lead" 
          />
        </div>
        
        <div className="grid gap-2">
          <FormLabel htmlFor="company">Empresa</FormLabel>
          <Input 
            id="company" 
            {...form.register('company', { required: true })} 
            placeholder="Nome da empresa" 
          />
        </div>
        
        <div className="grid gap-2">
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input 
            id="email" 
            type="email" 
            {...form.register('email', { required: true })} 
            placeholder="Email do contato" 
          />
        </div>
        
        <div className="grid gap-2">
          <FormLabel htmlFor="phone">Telefone</FormLabel>
          <Input 
            id="phone" 
            {...form.register('phone')} 
            placeholder="Telefone do contato" 
          />
        </div>
        
        <div className="grid gap-2">
          <FormLabel htmlFor="responsible">Responsável</FormLabel>
          <Select 
            onValueChange={value => form.setValue('responsible', value)} 
            defaultValue=""
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
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
};

export default NewLeadForm;
