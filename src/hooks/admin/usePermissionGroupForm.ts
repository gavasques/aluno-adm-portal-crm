
import { useState, useEffect, useCallback } from "react";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { useSystemMenus } from "@/hooks/admin/useSystemMenus";
import { recoveryModeUtils } from "@/hooks/auth/useRecoveryMode";

interface UsePermissionGroupFormProps {
  isEdit: boolean;
  permissionGroup?: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const usePermissionGroupForm = ({
  isEdit,
  permissionGroup,
  onOpenChange,
  onSuccess,
}: UsePermissionGroupFormProps) => {
  const { createPermissionGroup, updatePermissionGroup, getPermissionGroupMenus } = usePermissionGroups();
  const { systemMenus, isLoading: loadingMenus } = useSystemMenus();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [allowAdminAccess, setAllowAdminAccess] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingGroupData, setLoadingGroupData] = useState(isEdit);

  // Carregar dados do grupo para edição
  useEffect(() => {
    const loadGroupData = async () => {
      if (isEdit && permissionGroup) {
        console.log("=== LOADING GROUP DATA ===");
        console.log("permissionGroup:", permissionGroup);
        
        setName(permissionGroup.name || "");
        setDescription(permissionGroup.description || "");
        setIsAdmin(permissionGroup.is_admin || false);
        setAllowAdminAccess(permissionGroup.allow_admin_access || false);
        
        try {
          const menuData = await getPermissionGroupMenus(permissionGroup.id);
          const menuKeys = menuData.map((item: any) => item.menu_key);
          console.log("Menus carregados:", menuKeys);
          setSelectedMenus(menuKeys);
        } catch (error) {
          console.error("Erro ao carregar menus do grupo:", error);
        } finally {
          setLoadingGroupData(false);
        }
      } else {
        setLoadingGroupData(false);
      }
    };
    
    loadGroupData();
  }, [isEdit, permissionGroup, getPermissionGroupMenus]);

  // CORREÇÃO PRINCIPAL: Controlar comportamento APENAS do isAdmin
  useEffect(() => {
    console.log("=== ADMIN BEHAVIOR EFFECT ===");
    console.log("isAdmin:", isAdmin);
    console.log("allowAdminAccess:", allowAdminAccess);
    console.log("selectedMenus antes:", selectedMenus);
    
    if (isAdmin) {
      // APENAS admin completo (isAdmin = true) deve limpar menus e habilitar allowAdminAccess
      console.log("Admin completo detectado - limpando menus e habilitando acesso admin");
      setAllowAdminAccess(true);
      setSelectedMenus([]);
    }
    // IMPORTANTE: NÃO fazer nada quando apenas allowAdminAccess muda
    // Isso preserva os menus selecionados para admin limitado
    
    console.log("selectedMenus depois:", selectedMenus);
    console.log("allowAdminAccess depois:", allowAdminAccess);
    console.log("==============================");
  }, [isAdmin]); // APENAS isAdmin como dependência

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      setIsSubmitting(true);
      
      // VALIDAÇÃO: Verificar estado dos menus antes do submit
      let menusToSend: string[];
      
      console.log("=== SUBMIT VALIDATION ===");
      console.log("isAdmin:", isAdmin);
      console.log("allowAdminAccess:", allowAdminAccess);
      console.log("selectedMenus before submit:", selectedMenus);
      
      if (isAdmin) {
        // Admin completo - sem menus específicos (acesso total)
        menusToSend = [];
        console.log("SUBMIT: Admin completo - enviando array vazio");
      } else if (allowAdminAccess) {
        // Admin limitado - preservar menus selecionados
        menusToSend = selectedMenus;
        console.log("SUBMIT: Admin limitado - preservando menus:", menusToSend);
        
        // VALIDAÇÃO ADICIONAL: Verificar se não há inconsistência
        if (selectedMenus.length === 0) {
          console.warn("ATENÇÃO: Admin limitado sem menus selecionados!");
        }
      } else {
        // Usuário normal - preservar menus selecionados
        menusToSend = selectedMenus;
        console.log("SUBMIT: Usuário normal - preservando menus:", menusToSend);
      }
      
      console.log("menusToSend final:", menusToSend);
      console.log("========================");
      
      if (isEdit && permissionGroup) {
        await updatePermissionGroup({
          id: permissionGroup.id,
          name,
          description,
          is_admin: isAdmin,
          allow_admin_access: allowAdminAccess,
          menu_keys: menusToSend
        });
      } else {
        await createPermissionGroup({
          name,
          description,
          is_admin: isAdmin,
          allow_admin_access: allowAdminAccess,
          menu_keys: menusToSend
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar grupo de permissão:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, description, isAdmin, allowAdminAccess, selectedMenus, isEdit, permissionGroup, createPermissionGroup, updatePermissionGroup, onSuccess, onOpenChange]);

  const handleMenuToggle = useCallback((menuKey: string) => {
    console.log("=== MENU TOGGLE ===");
    console.log("Toggling menu:", menuKey);
    console.log("isAdmin:", isAdmin);
    console.log("allowAdminAccess:", allowAdminAccess);
    console.log("selectedMenus antes:", selectedMenus);
    
    // IMPORTANTE: Não permitir alteração de menus se for admin completo
    if (isAdmin) {
      console.log("Admin completo - toggle ignorado");
      return;
    }
    
    // Para admin limitado e usuário normal, permitir toggle normalmente
    setSelectedMenus((prev) => {
      const newMenus = prev.includes(menuKey)
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey];
      
      console.log("selectedMenus depois:", newMenus);
      console.log("==================");
      return newMenus;
    });
  }, [isAdmin]); // Remover allowAdminAccess da dependência

  // Log para monitorar mudanças de estado críticas
  useEffect(() => {
    console.log("=== STATE MONITORING ===");
    console.log("isAdmin:", isAdmin);
    console.log("allowAdminAccess:", allowAdminAccess);
    console.log("selectedMenus count:", selectedMenus.length);
    console.log("selectedMenus:", selectedMenus);
    
    // VALIDAÇÃO DE CONSISTÊNCIA
    if (!isAdmin && allowAdminAccess && selectedMenus.length === 0) {
      console.warn("⚠️ INCONSISTÊNCIA: Admin limitado sem menus!");
    }
    if (isAdmin && selectedMenus.length > 0) {
      console.warn("⚠️ INCONSISTÊNCIA: Admin completo com menus específicos!");
    }
    console.log("========================");
  }, [isAdmin, allowAdminAccess, selectedMenus]);

  const isLoading = loadingMenus || loadingGroupData;

  return {
    // Form state
    name,
    setName,
    description,
    setDescription,
    isAdmin,
    setIsAdmin,
    allowAdminAccess,
    setAllowAdminAccess,
    selectedMenus,
    isSubmitting,
    isLoading,
    systemMenus,
    // Handlers
    handleSubmit,
    handleMenuToggle,
  };
};
