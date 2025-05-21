
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';

export interface AllowedMenusResponse {
  menu_key: string;
}

export const useAllowedMenus = () => {
  const [allowedMenus, setAllowedMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  
  useEffect(() => {
    const fetchAllowedMenus = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Para admin, acesso completo
        if (profile.role === 'Admin') {
          setAllowedMenus(['dashboard', 'suppliers', 'partners', 'tools', 'my-suppliers', 'settings']);
        } else {
          // Para alunos, retornar com base no grupo de permissão
          const { data, error } = await supabase.rpc('get_allowed_menus');
          
          if (error) {
            console.error('Erro ao buscar menus permitidos:', error);
          } else if (data) {
            setAllowedMenus(data.map((item: AllowedMenusResponse) => item.menu_key));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar menus permitidos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllowedMenus();
  }, [profile]);
  
  const hasAccess = (menuKey: string) => {
    return profile?.role === 'Admin' || allowedMenus.includes(menuKey);
  };
  
  return { allowedMenus, loading, hasAccess };
};
