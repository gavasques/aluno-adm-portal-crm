
export interface Comment {
  id: number;
  text: string;
  date: string;
  user: string;
  likes: number;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  user: string;
  text: string;
  date: string;
}

export interface Rating {
  id: number;
  user: string;
  rating: number;
  comment: string;
  likes: number;
}

export interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface File {
  id: number;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export interface HistoryItem {
  id: number;
  action: string;
  user: string;
  date: string;
}

export interface Partner {
  id: number;
  name: string;
  category: string;
  type: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  website: string;
  recommended: boolean;
  ratings: Rating[];
  comments: Comment[];
  contacts: Contact[];
  files: File[];
  history: HistoryItem[];
}
