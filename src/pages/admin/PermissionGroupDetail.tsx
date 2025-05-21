
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, Save, ArrowLeft, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { PermissionGroupFormData } from "@/types/permission.types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  description: z.string().optional(),
  allowedMenus: z.array(z.string()).min(1, { 
    message: "Selecione pelo menos um menu" 
  })
});

const PermissionGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewGroup = id === "new";
  const groupId = isNewGroup ? 0 : Number(id);
  
  const { 
    getPermissionGroup, 
    createPermissionGroup, 
    updatePermissionGroup, 
    deletePermissionGroup, 
    studentMenuItems 
  } = usePermissionGroups();
  
  const [loading, setLoading] = useState(false);
  
  // Initialize form with default values or existing group data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      allowedMenus: []
    }
  });
  
  // Load existing group data if editing
  useEffect(() => {
    if (!isNewGroup) {
      const group = getPermissionGroup(groupId);
      if (group) {
        form.reset({
          name: group.name,
          description: group.description,
          allowedMenus: group.allowedMenus
        });
      } else {
        // Group not found, redirect to list
        navigate("/admin/permissions");
      }
    }
  }, [groupId, getPermissionGroup, isNewGroup, form, navigate]);
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      if (isNewGroup) {
        const newGroup = createPermissionGroup(data as PermissionGroupFormData);
        if (newGroup) {
          navigate("/admin/permissions");
        }
      } else {
        const updated = updatePermissionGroup(groupId, data as PermissionGroupFormData);
        if (updated) {
          navigate("/admin/permissions");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = () => {
    if (!isNewGroup) {
      deletePermissionGroup(groupId);
      navigate("/admin/permissions");
    }
  };
  
  const handleCancel = () => {
    navigate("/admin/permissions");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleCancel} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Shield className="h-8 w-8 mr-3 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          {isNewGroup ? "Novo Grupo de Permissão" : "Editar Grupo de Permissão"}
        </h1>
      </div>
      
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Informações do Grupo</CardTitle>
                <CardDescription>
                  Defina o nome e a descrição do grupo de permissão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Grupo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Acesso Básico" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome que identifica este grupo de permissões
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Grupo com acesso limitado aos recursos básicos" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Descrição breve do propósito deste grupo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Menus do Painel do Aluno</h3>
                  <FormField
                    control={form.control}
                    name="allowedMenus"
                    render={() => (
                      <FormItem>
                        <div className="space-y-4">
                          {studentMenuItems.map((menuItem) => (
                            <FormField
                              key={menuItem.id}
                              control={form.control}
                              name="allowedMenus"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={menuItem.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(menuItem.id)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = [...field.value];
                                          if (checked) {
                                            field.onChange([...currentValue, menuItem.id]);
                                          } else {
                                            field.onChange(
                                              currentValue.filter((value) => value !== menuItem.id)
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium">
                                        {menuItem.name}
                                      </FormLabel>
                                      <FormDescription>
                                        {menuItem.description}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-between">
              <div>
                {!isNewGroup && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" type="button">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir grupo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este grupo de permissão?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleDelete}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" type="button" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="bg-purple-700 hover:bg-purple-800">
                  {loading && <span className="spinner mr-2" />}
                  <Save className="mr-2 h-4 w-4" />
                  {isNewGroup ? "Criar Grupo" : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PermissionGroupDetail;
