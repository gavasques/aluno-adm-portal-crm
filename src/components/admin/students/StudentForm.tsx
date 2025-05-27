
import React, { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

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
  userEmail: z.string().email({ message: "Email do usuário inválido" }),
});

interface StudentFormProps {
  onSubmit: (data: any, userFound: any) => void;
  onCancel: () => void;
  userSearchError: string;
  setUserSearchError: (error: string) => void;
  userFound: any;
  setUserFound: (user: any) => void;
  isSubmitting?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  onCancel,
  userSearchError,
  setUserSearchError,
  userFound,
  setUserFound,
  isSubmitting = false
}) => {
  const [isSearching, setIsSearching] = useState(false);

  // Create form
  const form = useForm({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      amazonStoreLink: "",
      studentState: "",
      companyState: "",
      usesFBA: "",
      userEmail: "",
    },
  });

  // Handle search for user by email
  const handleUserSearch = async (email) => {
    if (!email) {
      setUserSearchError("Por favor, insira um email");
      setUserFound(null);
      return;
    }

    try {
      setIsSearching(true);
      setUserSearchError("");
      
      // Buscar o usuário pelo email
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .limit(1);
      
      if (error) throw error;
      
      if (profilesData && profilesData.length > 0) {
        const foundUser = profilesData[0];
        setUserFound(foundUser);
        
        // Preencher campos do formulário com dados do usuário
        form.setValue("name", foundUser.name || "");
        form.setValue("email", foundUser.email || "");
        
        toast({
          title: "Usuário encontrado",
          description: `${foundUser.name} (${foundUser.email})`
        });
      } else {
        setUserFound(null);
        setUserSearchError("Usuário não encontrado com este email");
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setUserSearchError("Erro ao buscar usuário");
    } finally {
      setIsSearching(false);
    }
  };

  // Watch user email field for changes
  const userEmail = form.watch("userEmail");

  const handleFormSubmit = (data) => {
    onSubmit(data, userFound);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
        
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-2">Relacionar Usuário</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Usuário*</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="email.usuario@exemplo.com" 
                        {...field} 
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      onClick={() => handleUserSearch(field.value)}
                      disabled={isSearching}
                    >
                      {isSearching ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                      Buscar
                    </Button>
                  </div>
                  <FormMessage />
                  {userSearchError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>
                        {userSearchError}
                      </AlertDescription>
                    </Alert>
                  )}
                  {userFound && (
                    <Alert className="mt-2 bg-green-50 text-green-800 border-green-200">
                      <AlertTitle>Usuário encontrado</AlertTitle>
                      <AlertDescription>
                        {userFound.name} - {userFound.email}
                      </AlertDescription>
                    </Alert>
                  )}
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || isSearching || !userFound}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Adicionando...
              </>
            ) : (
              "Adicionar Aluno"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default StudentForm;
