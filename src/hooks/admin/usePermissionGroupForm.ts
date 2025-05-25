
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
        console.log("=== LOADING GROUP DATA FOR EDIT ===");
        console.log("permissionGroup:", permissionGroup);
        
        setName(permissionGroup.name || "");
        setDescription(permissionGroup.description || "");
        setIsAdmin(permissionGroup.is_admin || false);
        setAllowAdminAccess(permissionGroup.allow_admin_access || false);
        
        try {
          const menuData = await getPermissionGroupMenus(permissionGroup.id);
          const menuKeys = menuData.map((item: any) => item.menu_key);
          console.log("✅ Menus carregados para edição:", menuKeys);
          setSelectedMenus(menuKeys);
        } catch (error) {
          console.error("❌ Erro ao carregar menus do grupo:", error);
          setSelectedMenus([]);
        } finally {
          setLoadingGroupData(false);
        }
      } else {
        // Reset para criação de novo grupo
        console.log("=== RESET FOR NEW GROUP ===");
        setName("");
        setDescription("");
        setIsAdmin(false);
        setAllowAdminAccess(false);
        setSelectedMenus([]);
        setLoadingGroupData(false);
      }
    };
    
    loadGroupData();
  }, [isEdit, permissionGroup?.id, getPermissionGroupMenus]);

  // CORREÇÃO CRÍTICA: Comportamento APENAS quando isAdmin muda
  useEffect(() => {
    console.log("=== ADMIN BEHAVIOR EFFECT (FIXED) ===");
    console.log("isAdmin mudou para:", isAdmin);
    console.log("allowAdminAccess atual:", allowAdminAccess);
    console.log("selectedMenus antes da verificação:", selectedMenus.length);
    
    if (isAdmin) {
      // APENAS admin completo (isAdmin = true) deve limpar menus
      console.log("🔴 ADMIN COMPLETO: Limpando menus e habilitando acesso admin");
      setSelectedMenus([]);
      setAllowAdminAccess(true);
      console.log("✅ Menus limpos para admin completo");
    }
    // IMPORTANTE: NÃO fazer nada quando allowAdminAccess muda
    // Isso preserva os menus para admin limitado
    
    console.log("selectedMenus final:", isAdmin ? [] : selectedMenus.length);
    console.log("=====================================");
  }, [isAdmin]); // APENAS isAdmin como dependência - CRÍTICO!

  // Handler customizado para allowAdminAccess (SEM dependência problemática)
  const handleAllowAdminAccessChange = useCallback((value: boolean) => {
    console.log("=== ALLOW ADMIN ACCESS CHANGE (FIXED) ===");
    console.log("Mudando allowAdminAccess de", allowAdminAccess, "para", value);
    console.log("isAdmin atual:", isAdmin);
    console.log("selectedMenus atuais:", selectedMenus.length);
    
    if (!isAdmin) {
      // Para usuários não-admin, apenas mudar o allowAdminAccess
      // SEM TOCAR nos menus selecionados - CRÍTICO!
      console.log("✅ Usuário não é admin completo - PRESERVANDO menus");
      setAllowAdminAccess(value);
      console.log("✅ allowAdminAccess alterado, menus preservados");
    } else {
      // Admin completo sempre tem allowAdminAccess = true
      console.log("⚠️ Admin completo - mantendo allowAdminAccess = true");
      setAllowAdminAccess(true);
    }
    
    console.log("selectedMenus após mudança:", selectedMenus.length);
    console.log("==========================================");
  }, [isAdmin, allowAdminAccess]); // Removida dependência de selectedMenus - CORREÇÃO CRÍTICA

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      setIsSubmitting(true);
      
      // VALIDAÇÃO CRÍTICA: Verificar estado antes do submit
      let menusToSend: string[];
      
      console.log("=== SUBMIT VALIDATION (FIXED) ===");
      console.log("Estado final antes do submit:");
      console.log("- isAdmin:", isAdmin);
      console.log("- allowAdminAccess:", allowAdminAccess);
      console.log("- selectedMenus count:", selectedMenus.length);
      console.log("- selectedMenus:", selectedMenus);
      
      if (isAdmin) {
        // Admin completo - sem menus específicos (acesso total)
        menusToSend = [];
        console.log("✅ SUBMIT: Admin completo - enviando array vazio");
      } else {
        // Admin limitado ou usuário normal - preservar menus selecionados
        menusToSend = [...selectedMenus]; // Clonar array para segurança
        console.log("✅ SUBMIT: Admin limitado/usuário normal - preservando menus:", menusToSend.length);
        
        // VALIDAÇÃO FINAL: Verificar inconsistências
        if (allowAdminAccess && selectedMenus.length === 0) {
          console.warn("⚠️ ATENÇÃO: Admin limitado sem menus selecionados!");
        }
      }
      
      console.log("menusToSend final para backend:", menusToSend.length, "menus");
      console.log("=================================");
      
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
      console.error("❌ Erro ao salvar grupo de permissão:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, description, isAdmin, allowAdminAccess, selectedMenus, isEdit, permissionGroup, createPermissionGroup, updatePermissionGroup, onSuccess, onOpenChange]);

  const handleMenuToggle = useCallback((menuKey: string) => {
    console.log("=== MENU TOGGLE (FIXED) ===");
    console.log("Toggling menu:", menuKey);
    console.log("isAdmin:", isAdmin);
    console.log("allowAdminAccess:", allowAdminAccess);
    console.log("selectedMenus antes:", selectedMenus.length);
    
    // PROTEÇÃO: Não permitir alteração se for admin completo
    if (isAdmin) {
      console.log("🔴 Admin completo - toggle bloqueado");
      return;
    }
    
    // Para admin limitado e usuário normal, permitir toggle
    setSelectedMenus((prev) => {
      const newMenus = prev.includes(menuKey)
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey];
      
      console.log("✅ selectedMenus atualizado:", newMenus.length, "menus");
      console.log("==============================");
      return newMenus;
    });
  }, [isAdmin]); // Removida dependência de selectedMenus - CORREÇÃO CRÍTICA

  // Monitor de estado para debug (sem dependência problemática)
  useEffect(() => {
    console.log("=== STATE MONITOR (SAFE) ===");
    console.log("Estado atual:");
    console.log("- isAdmin:", isAdmin);
    console.log("- allowAdminAccess:", allowAdminAccess);
    console.log("- selectedMenus count:", selectedMenus.length);
    
    // VALIDAÇÃO DE CONSISTÊNCIA
    if (!isAdmin && allowAdminAccess && selectedMenus.length === 0) {
      console.warn("⚠️ INCONSISTÊNCIA: Admin limitado sem menus!");
    }
    if (isAdmin && selectedMenus.length > 0) {
      console.warn("⚠️ INCONSISTÊNCIA: Admin completo com menus específicos!");
    }
    console.log("============================");
  }, [isAdmin, allowAdminAccess, selectedMenus.length]); // Usar length para evitar dependência do array

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
    setAllowAdminAccess: handleAllowAdminAccessChange, // Usar handler customizado
    selectedMenus,
    isSubmitting,
    isLoading,
    systemMenus,
    // Handlers
    handleSubmit,
    handleMenuToggle,
  };
};
