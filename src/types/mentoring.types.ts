
export interface MentoriaCatalogo {
  id: string;
  nome_mentoria: string;
  descricao?: string;
  tipo_mentoria: 'INDIVIDUAL' | 'GRUPO';
  instrutor_principal_id?: string;
  instrutor_principal_nome?: string;
  duracao_acesso_dias?: number;
  sessoes_padrao_individual?: number;
  preco?: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AlunoInscricaoMentoria {
  id: string;
  aluno_id: string;
  aluno_nome: string;
  mentoria_catalogo_id: string;
  mentoria_catalogo: MentoriaCatalogo;
  mentor_designado_id?: string;
  mentor_designado_nome?: string;
  tipo_mentoria_inscricao: 'INDIVIDUAL' | 'GRUPO';
  data_inicio_acesso: string;
  data_fim_acesso: string;
  status_inscricao: 'ATIVA' | 'CONCLUIDA' | 'CANCELADA';
  total_sessoes_contratadas_ind?: number;
  sessoes_realizadas_ind: number;
  observacoes_adm?: string;
  created_at: string;
  updated_at: string;
}

export interface MentoriaEncontroSessao {
  id: string;
  mentoria_catalogo_id?: string;
  mentoria_catalogo?: MentoriaCatalogo;
  aluno_inscricao_id?: string;
  aluno_inscricao?: AlunoInscricaoMentoria;
  titulo_encontro_sessao: string;
  descricao_detalhada?: string;
  data_hora_agendada: string;
  duracao_estimada_min?: number;
  link_plataforma_online?: string;
  link_gravacao?: string;
  status_encontro_sessao: 'AGENDADO' | 'REALIZADO' | 'CANCELADO';
  anotacoes_instrutor_mentor?: string;
  created_at: string;
  updated_at: string;
}

export interface MentoriaMaterialAnexado {
  id: string;
  encontro_sessao_id: string;
  uploader_id: string;
  uploader_nome: string;
  nome_arquivo: string;
  storage_object_path: string;
  tipo_mime_arquivo?: string;
  tamanho_arquivo_bytes?: number;
  descricao_material?: string;
  data_upload: string;
}

export interface MentoringFormData {
  nome_mentoria: string;
  descricao: string;
  tipo_mentoria: 'INDIVIDUAL' | 'GRUPO';
  instrutor_principal_id: string;
  duracao_acesso_dias: number;
  sessoes_padrao_individual?: number;
  preco: number;
}

export interface SessionFormData {
  titulo_encontro_sessao: string;
  descricao_detalhada: string;
  data_hora_agendada: string;
  duracao_estimada_min: number;
  link_plataforma_online: string;
  status_encontro_sessao: 'AGENDADO' | 'REALIZADO' | 'CANCELADO';
}
