
// Centralized microcopy and messages for consistent UX
export const microcopy = {
  // Common actions
  actions: {
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    add: "Adicionar",
    create: "Criar",
    update: "Atualizar",
    remove: "Remover",
    search: "Pesquisar",
    filter: "Filtrar",
    export: "Exportar",
    import: "Importar",
    upload: "Enviar",
    download: "Baixar",
    copy: "Copiar",
    share: "Compartilhar",
    print: "Imprimir",
    refresh: "Atualizar",
    reload: "Recarregar",
    retry: "Tentar novamente",
    continue: "Continuar",
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    finish: "Finalizar",
    submit: "Enviar",
    confirm: "Confirmar",
    apply: "Aplicar"
  },

  // Loading states
  loading: {
    default: "Carregando...",
    saving: "Salvando...",
    deleting: "Excluindo...",
    uploading: "Enviando...",
    processing: "Processando...",
    searching: "Buscando...",
    loading_data: "Carregando dados...",
    updating: "Atualizando...",
    connecting: "Conectando...",
    syncing: "Sincronizando...",
    validating: "Validando...",
    generating: "Gerando...",
    calculating: "Calculando...",
    preparing: "Preparando..."
  },

  // Success messages
  success: {
    saved: "Dados salvos com sucesso",
    created: "Item criado com sucesso",
    updated: "Item atualizado com sucesso",
    deleted: "Item excluído com sucesso",
    uploaded: "Arquivo enviado com sucesso",
    copied: "Copiado para a área de transferência",
    sent: "Enviado com sucesso",
    imported: "Dados importados com sucesso",
    exported: "Dados exportados com sucesso",
    synchronized: "Sincronização concluída",
    processed: "Processamento concluído",
    validated: "Validação bem-sucedida",
    connected: "Conexão estabelecida",
    configured: "Configuração salva"
  },

  // Error messages
  errors: {
    generic: "Ocorreu um erro inesperado",
    network: "Erro de conexão. Verifique sua internet",
    server: "Erro no servidor. Tente novamente",
    validation: "Dados inválidos. Verifique os campos",
    not_found: "Item não encontrado",
    unauthorized: "Você não tem permissão para esta ação",
    forbidden: "Acesso negado",
    timeout: "A operação demorou muito para responder",
    file_too_large: "Arquivo muito grande",
    invalid_format: "Formato de arquivo inválido",
    required_field: "Este campo é obrigatório",
    invalid_email: "Email inválido",
    weak_password: "Senha muito fraca",
    passwords_dont_match: "Senhas não coincidem",
    already_exists: "Este item já existe",
    quota_exceeded: "Limite excedido",
    session_expired: "Sessão expirada. Faça login novamente"
  },

  // Field labels and placeholders
  fields: {
    email: {
      label: "Email",
      placeholder: "Digite seu email",
      helper: "Usaremos este email para contato"
    },
    password: {
      label: "Senha",
      placeholder: "Digite sua senha",
      helper: "Mínimo de 8 caracteres"
    },
    name: {
      label: "Nome",
      placeholder: "Digite o nome completo",
      helper: "Como você gostaria de ser chamado"
    },
    phone: {
      label: "Telefone",
      placeholder: "(11) 99999-9999",
      helper: "Formato: (DD) NNNNN-NNNN"
    },
    company: {
      label: "Empresa",
      placeholder: "Nome da empresa",
      helper: "Empresa onde trabalha ou representa"
    },
    website: {
      label: "Website",
      placeholder: "https://exemplo.com",
      helper: "URL completa do site"
    },
    description: {
      label: "Descrição",
      placeholder: "Descreva brevemente...",
      helper: "Máximo de 500 caracteres"
    }
  },

  // Empty states
  empty: {
    no_data: "Nenhum dado encontrado",
    no_results: "Nenhum resultado para sua busca",
    no_items: "Nenhum item cadastrado",
    no_files: "Nenhum arquivo enviado",
    no_users: "Nenhum usuário encontrado",
    no_permissions: "Nenhuma permissão configurada",
    no_notifications: "Nenhuma notificação",
    no_history: "Nenhum histórico disponível",
    empty_folder: "Pasta vazia",
    empty_list: "Lista vazia"
  },

  // Confirmations
  confirmations: {
    delete: "Tem certeza que deseja excluir este item?",
    delete_permanent: "Esta ação não pode ser desfeita",
    unsaved_changes: "Você tem alterações não salvas. Deseja sair?",
    reset: "Tem certeza que deseja resetar os dados?",
    logout: "Deseja sair do sistema?",
    overwrite: "Já existe um item com este nome. Deseja substituir?",
    bulk_delete: "Tem certeza que deseja excluir os itens selecionados?",
    clear_data: "Tem certeza que deseja limpar todos os dados?"
  },

  // Status messages
  status: {
    online: "Online",
    offline: "Offline",
    connecting: "Conectando...",
    connected: "Conectado",
    disconnected: "Desconectado",
    synced: "Sincronizado",
    syncing: "Sincronizando...",
    up_to_date: "Atualizado",
    outdated: "Desatualizado",
    pending: "Pendente",
    processing: "Processando",
    completed: "Concluído",
    failed: "Falhou",
    cancelled: "Cancelado",
    paused: "Pausado",
    draft: "Rascunho",
    published: "Publicado",
    archived: "Arquivado"
  }
};

// Helper functions for dynamic messages
export const getMicrocopy = {
  itemCount: (count: number, singular: string, plural: string) => 
    count === 1 ? `${count} ${singular}` : `${count} ${plural}`,
  
  timeAgo: (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  },
  
  fileSize: (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  },
  
  percentage: (value: number, total: number) => 
    total > 0 ? `${Math.round((value / total) * 100)}%` : '0%'
};
