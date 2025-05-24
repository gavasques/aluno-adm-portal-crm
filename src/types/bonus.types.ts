
export type BonusType = "Software" | "Sistema" | "IA" | "Ebook" | "Lista" | "Outros";
export type AccessPeriod = "7 dias" | "15 dias" | "30 dias" | "2 Meses" | "3 Meses" | "6 Meses" | "1 Ano" | "Vitalício";

export interface Bonus {
  id: string;
  bonus_id: string;
  name: string;
  type: BonusType;
  description: string;
  access_period: AccessPeriod;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface BonusComment {
  id: string;
  bonus_id: string;
  user_id: string;
  content: string;
  author_name: string;
  likes: number;
  user_liked: boolean;
  created_at: string;
}

export interface BonusFile {
  id: string;
  bonus_id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  description?: string;
  file_path: string;
  uploaded_at: string;
}

export interface BonusStats {
  total: number;
  byType: Record<BonusType, number>;
  recentlyAdded: number;
}
