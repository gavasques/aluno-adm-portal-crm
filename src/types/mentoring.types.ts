
export interface GroupEnrollment {
  id: string;
  groupName: string;
  responsibleMentor: string;
  status: 'ativa' | 'concluida' | 'pausada' | 'cancelada';
  mentoring: {
    id: string;
    name: string;
    type: string;
  };
  participants: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  startDate: string;
  endDate: string;
  sessionsCompleted: number;
  totalSessions: number;
  createdAt: string;
}

export interface MentoringEnrollment {
  id: string;
  student_id: string;
  mentoring_id: string;
  status: string;
  enrollment_date: string;
  start_date: string;
  end_date: string;
  payment_status: string;
  responsible_mentor: string;
  observations?: string;
  total_sessions: number;
  sessions_used: number;
  has_extension: boolean;
  original_end_date?: string;
  created_at: string;
  updated_at: string;
  group_id?: string;
}

// Alias para compatibilidade com componentes existentes
export interface StudentMentoringEnrollment {
  id: string;
  studentId: string;
  mentoring: {
    id: string;
    name: string;
    type: 'Individual' | 'Grupo';
  };
  status: 'ativa' | 'concluida' | 'pausada' | 'cancelada';
  startDate: string;
  endDate: string;
  enrollmentDate: string;
  paymentStatus: string;
  responsibleMentor: string;
  observations?: string;
  totalSessions: number;
  sessionsUsed: number;
  hasExtension: boolean;
  originalEndDate?: string;
  createdAt: string;
  updatedAt: string;
  groupId?: string;
}

export interface MentoringSession {
  id: string;
  enrollment_id: string;
  type: 'individual' | 'group';
  status: 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento';
  scheduled_date?: string;
  scheduled_time?: string;
  duration_minutes: number;
  meeting_link?: string;
  title: string;
  observations?: string;
  session_number: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExtensionData {
  enrollmentId: string;
  extensionMonths: number;
  notes?: string;
}

export interface MentoringExtension {
  id: string;
  enrollment_id: string;
  extension_months: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MentoringExtensionOption {
  id: string;
  months: number;
  price: number;
  description: string;
  isActive: boolean;
}

export interface MentoringCatalog {
  id: string;
  name: string;
  description: string;
  instructor: string;
  type: 'Individual' | 'Grupo';
  durationMonths: number;
  numberOfSessions: number;
  totalSessions: number;
  price: number;
  active: boolean;
  category?: string;
  tags?: string[];
  extensions?: MentoringExtensionOption[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMentoringCatalogData {
  name: string;
  description: string;
  instructor: string;
  type: 'Individual' | 'Grupo';
  durationMonths: number;
  numberOfSessions: number;
  price: number;
  active: boolean;
  category?: string;
  tags?: string[];
  extensions?: MentoringExtensionOption[];
}

export interface CheckoutLinks {
  individual?: string;
  group?: string;
  extension?: string;
}

export interface MentoringDashboardStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalSessions: number;
  completedSessions: number;
  revenue: number;
}

export interface MentoringFilters {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  mentorFilter: string;
}

export interface SessionFormData {
  title: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  meetingLink?: string;
  observations?: string;
}

export interface EnrollmentFormData {
  studentId: string;
  mentoringId: string;
  startDate: string;
  endDate: string;
  responsibleMentor: string;
  observations?: string;
  paymentStatus: string;
}

export type MentoringStatus = 'ativa' | 'concluida' | 'pausada' | 'cancelada';
export type SessionStatus = 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento';
export type PaymentStatus = 'pago' | 'pendente' | 'atrasado' | 'cancelado';
export type MentoringType = 'Individual' | 'Grupo';
