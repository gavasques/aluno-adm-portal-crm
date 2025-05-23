
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermissionGroups, PermissionGroupWithMenus } from "@/hooks/admin/usePermissionGroups";
import { useSystemMenus } from "@/hooks/admin/useSystemMenus";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  is_admin: z.boolean().default(false),
  menu_keys: z.array(z.string()).optional(),
});

interface PermissionGroupFormProps {
  isEdit: boolean;
  permissionGroup?: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PermissionGroupForm: React.FC<PermissionGroupFormProps> = ({
  isEdit,
  permissionGroup,
  onOpenChange,
  onSuccess,
}) => {
  const { 
    createPermissionGroup, 
    updatePermissionGroup,
    getPermissionGroupMenus,
  } = usePermissionGroups();
  const { systemMenus, isLoading: menusLoading } = useSystemMenus();
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMenus, setIsLoadingMenus] = useState(isEdit);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isEdit ? permissionGroup?.name : "",
      description: isEdit ? permissionGroup?.description || "" : "",
      is_admin: isEdit ? permissionGroup?.is_admin || false : false,
      menu_keys: [],
    },
  });

  useEffect(() => {
    // Se estiver em modo de edição, carregar os menus associados ao grupo
    if (isEdit && permissionGroup) {
      const loadPermissionGroupMenus = async () => {
        try {
          const menus = await getPermissionGroupMenus(permissionGroup.id);
          setSelectedMenus(menus.map((menu: any) => menu.menu_key));
          setIsLoadingMenus(false);
        } catch (error) {
          console.error("Erro ao carregar menus:", error);
          setIsLoadingMenus(false);
        }
      };
      
      loadPermissionGroupMenus();
    }
  }, [isEdit, permissionGroup, getPermissionGroupMenus]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      if (isEdit) {
        // Atualizar grupo existente
        const updateData: PermissionGroupWithMenus = {
          id: permissionGroup.id,
          name: values.name, // Garantir que name é fornecido
          description: values.description || null,
          is_admin: values.is_admin,
          menu_keys: values.is_admin ? [] : selectedMenus,
        };
        await updatePermissionGroup(updateData);
      } else {
        // Criar novo grupo
        const createData: PermissionGroupWithMenus = {
          name: values.name, // Garantir que name é fornecido
          description: values.description || null,
          is_admin: values.is_admin,
          menu_keys: values.is_admin ? [] : selectedMenus,
        };
        await createPermissionGroup(createData);
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar grupo de permissão:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMenuChange = (menuKey: string, checked: boolean) => {
    if (checked) {
      setSelectedMenus([...selectedMenus, menuKey]);
    } else {
      setSelectedMenus(selectedMenus.filter(key => key !== menuKey));
    }
  };

  const isAdmin = form.watch("is_admin");

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar" : "Criar"} Grupo de Permissão</DialogTitle>
      </DialogHeader>
      
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do grupo" {...field} />
                  </FormControl>
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
                      placeholder="Descrição do grupo (opcional)" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_admin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Acesso Administrativo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Usuários com este grupo terão acesso completo ao sistema.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            {!isAdmin && !menusLoading && !isLoadingMenus && (
              <>
                <Separator className="my-4" />
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Permissões de Acesso</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecione as áreas do sistema que este grupo poderá acessar.
                  </p>
                  
                  <ScrollArea className="h-[200px] px-1">
                    <div className="space-y-2">
                      {systemMenus.map((menu) => (
                        <div key={menu.menu_key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`menu-${menu.menu_key}`}
                            checked={selectedMenus.includes(menu.menu_key)}
                            onCheckedChange={(checked) => 
                              handleMenuChange(menu.menu_key, checked === true)
                            }
                          />
                          <label
                            htmlFor={`menu-${menu.menu_key}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {menu.display_name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {selectedMenus.length === 0 && (
                    <p className="text-sm text-orange-600 mt-2">
                      Atenção: Sem permissões selecionadas, os usuários deste grupo não poderão acessar nenhuma área do sistema.
                    </p>
                  )}
                </div>
              </>
            )}
            
            {(menusLoading || isLoadingMenus) && !isAdmin && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Carregando menus...</span>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PermissionGroupForm;
