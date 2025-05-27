
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function validateAuthToken(authHeader: string | null, supabaseAdmin: any) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error("Token de autorização ausente ou inválido");
    throw new Error('Token de autorização necessário');
  }

  const token = authHeader.replace('Bearer ', '');
  console.log("Token presente, validando...");

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  
  if (userError || !user) {
    console.error("Erro ao validar token:", userError);
    throw new Error('Token inválido ou expirado');
  }

  console.log("✅ Usuário autenticado:", user.email, "ID:", user.id);
  return user;
}

export async function checkAdminPermissions(user: any, supabaseAdmin: any): Promise<boolean> {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role, permission_group_id')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Erro ao buscar perfil do usuário:", profileError);
    throw new Error('Erro ao verificar permissões');
  }

  console.log("Profile do usuário encontrado:", profile);

  let isAdmin = profile?.role === 'Admin';

  if (!isAdmin && profile?.permission_group_id) {
    const { data: permissionGroup, error: groupError } = await supabaseAdmin
      .from('permission_groups')
      .select('is_admin, allow_admin_access')
      .eq('id', profile.permission_group_id)
      .single();

    if (!groupError && permissionGroup) {
      isAdmin = permissionGroup.is_admin === true || permissionGroup.allow_admin_access === true;
      console.log("Verificação de grupo:", permissionGroup);
    }
  }

  console.log("✅ Usuário é admin:", isAdmin);

  if (!isAdmin) {
    console.error("❌ Usuário sem permissões administrativas");
    throw new Error('Você não tem permissões para criar usuários');
  }

  return isAdmin;
}
