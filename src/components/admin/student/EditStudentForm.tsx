
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

// Brazilian states array
const brazilianStates = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
  "Fora do Brasil"
];

// Schema for student form validation
const studentFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone deve ter pelo menos 8 caracteres" }),
  company: z.string().optional(),
  amazonStoreLink: z.string().optional(),
  studentState: z.string().optional(),
  companyState: z.string().optional(),
  usesFBA: z.string().optional(),
});

interface EditStudentFormProps {
  student: any;
  onSave: (data: any) => void;
}

const EditStudentForm: React.FC<EditStudentFormProps> = ({ student, onSave }) => {
  const { toast } = useToast();
  
  // Create form
  const form = useForm({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
      phone: student?.phone || "",
      company: student?.company || "",
      amazonStoreLink: student?.amazonStoreLink || "",
      studentState: student?.studentState || "",
      companyState: student?.companyState || "",
      usesFBA: student?.usesFBA || "",
    },
  });

  // Update form when student changes
  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        company: student.company || "",
        amazonStoreLink: student.amazonStoreLink || "",
        studentState: student.studentState || "",
        companyState: student.companyState || "",
        usesFBA: student.usesFBA || "",
      });
    }
  }, [student, form]);

  // Handle form submission
  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Editar Informações do Aluno
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amazonStoreLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da Loja na Amazon</FormLabel>
                    <FormControl>
                      <Input placeholder="https://amazon.com/shops/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado do Aluno</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brazilianStates.map((state, index) => (
                          <SelectItem key={index} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado da Empresa</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brazilianStates.map((state, index) => (
                          <SelectItem key={index} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usesFBA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trabalha com FBA</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sim">Sim</SelectItem>
                        <SelectItem value="Não">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditStudentForm;
