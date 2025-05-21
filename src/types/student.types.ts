
export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  amazonStoreLink?: string;
  studentState?: string;
  companyState?: string;
  usesFBA?: string;
  status: string;
  lastLogin: string;
  registrationDate: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  permissionGroupId?: number;
}

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  amazonStoreLink?: string;
  studentState?: string;
  companyState?: string;
  usesFBA?: string;
  userEmail: string;
  permissionGroupId: number;
}
