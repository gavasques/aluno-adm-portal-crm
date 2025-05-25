
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, Mail, Lock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Schema para validação dos dados do formulário
const settingsFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Dados simulados do usuário atual
const defaultValues: Partial<SettingsFormValues> = {
  name: "Administrador",
  email: "admin@portaledu.com",
  password: "",
};

const AdminSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Inicializar o formulário com react-hook-form
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  // Função para lidar com a submissão do formulário
  function onSubmit(data: SettingsFormValues) {
    setIsSubmitting(true);
    
    // Simulação de API call
    setTimeout(() => {
      console.log(data);
      toast.success("Configurações atualizadas com sucesso!");
      setIsSubmitting(false);
    }, 1000);
  }

  // Função para ir para a área do aluno
  const goToStudentArea = () => {
    window.location.href = "/student";
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Configurações' }
  ];

  return (
    <div className="container mx-auto py-10">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-6"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <CardTitle className="text-2xl text-white">Configurações da Conta</CardTitle>
            <CardDescription className="text-blue-100">
              Atualize suas informações pessoais e senha
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-blue-700">
                          <User className="h-4 w-4" />
                          Nome
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu nome" 
                            {...field} 
                            className="focus:ring-blue-500 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-blue-700">
                          <Mail className="h-4 w-4" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu.email@exemplo.com" 
                            type="email" 
                            {...field} 
                            className="focus:ring-blue-500 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-blue-700">
                          <Lock className="h-4 w-4" />
                          Nova Senha
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nova senha" 
                            type="password" 
                            {...field} 
                            className="focus:ring-blue-500 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-blue-50"
                    onClick={goToStudentArea}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ir para Área do Aluno
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="bg-gray-50 text-sm text-gray-500 border-t">
            Suas informações são protegidas de acordo com nossa política de privacidade.
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
