


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
    studentId?: string;
    sessionsUsed?: number;
    totalSessions?: number;
    status?: string;
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
  mentoring_id?: string; // Added for compatibility
  mentoringId?: string; // Added for compatibility
  mentoring: {
    id: string;
    name: string;
    type: 'Individual' | 'Grupo';
    frequency?: string;
    durationMonths?: number;
    extensions?: MentoringExtensionOption[];
    description?: string; // Added for compatibility
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
  extensions?: MentoringExtension[]; // Added for compatibility
}

export interface MentoringSession {
  id: string;
  enrollment_id: string;
  enrollmentId?: string; // Alias para compatibilidade
  type: 'individual' | 'group';
  status: 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento' | 'no_show_aluno' | 'no_show_mentor' | 'reagendada';
  scheduled_date?: string;
  scheduledDate?: string; // Alias para compatibilidade
  scheduled_time?: string;
  duration_minutes: number;
  durationMinutes?: number; // Alias para compatibilidade
  meeting_link?: string;
  meetingLink?: string; // Alias para compatibilidade
  title: string;
  observations?: string;
  session_number: number;
  sessionNumber?: number; // Alias para compatibilidade
  completed_at?: string;
  created_at: string;
  createdAt?: string; // Alias para compatibilidade
  updated_at: string;
  updatedAt?: string; // Alias para compatibilidade
  mentorNotes?: string;
  mentor_notes?: string; // Database field
  transcription?: string;
  recordingLink?: string;
  recording_link?: string; // Database field
  calendly_link?: string;
  calendlyLink?: string; // Alias para compatibilidade
  student_notes?: string;
  studentNotes?: string; // Alias para compatibilidade
  group_id?: string;
  groupId?: string; // Alias para compatibilidade
}

export interface CreateExtensionData {
  enrollmentId: string;
  extensionMonths: number;
  notes?: string;
}

export interface MentoringExtension {
  id: string;
  enrollment_id: string;
  enrollmentId?: string; // Alias para compatibilidade
  extension_months: number;
  extensionMonths?: number; // Alias para compatibilidade
  notes?: string;
  created_at: string;
  createdAt?: string; // Alias para compatibilidade
  updated_at?: string;
  updatedAt?: string; // Alias para compatibilidade
  applied_date?: string;
  appliedDate?: string; // Alias para compatibilidade
  admin_id?: string; // Database field
  adminId?: string; // Alias para compatibilidade
}

export interface CheckoutLinks {
  individual?: string;
  group?: string;
  extension?: string;
  mercadoPago?: string;
  hubla?: string;
  hotmart?: string;
}

export interface MentoringExtensionOption {
  id: string;
  months: number;
  price: number;
  description: string;
  isActive?: boolean;
  totalSessions?: number;
  checkoutLinks?: CheckoutLinks;
}

export type FrequencyType = 'Semanal' | 'Quinzenal' | 'Mensal';

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
  status: 'Ativa' | 'Inativa' | 'Cancelada';
  createdAt: string;
  updatedAt: string;
  frequency?: FrequencyType;
  checkoutLinks?: CheckoutLinks;
  imageUrl?: string;
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
  frequency?: FrequencyType;
  checkoutLinks?: CheckoutLinks;
  status?: 'Ativa' | 'Inativa' | 'Cancelada';
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

export interface CreateSessionData {
  enrollmentId: string;
  title: string;
  scheduledDate?: string;
  scheduledTime?: string;
  durationMinutes: number;
  meetingLink?: string;
  observations?: string;
  sessionNumber: number;
  type: 'individual' | 'group';
  status?: 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento' | 'no_show_aluno' | 'no_show_mentor' | 'reagendada';
  groupId?: string; // Added for compatibility
}

export interface UpdateSessionData {
  title?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  durationMinutes?: number;
  meetingLink?: string;
  observations?: string;
  status?: 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento' | 'no_show_aluno' | 'no_show_mentor' | 'reagendada';
  mentorNotes?: string;
  transcription?: string;
  recordingLink?: string;
  calendlyLink?: string; // Added missing property
  studentNotes?: string; // Added missing property
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

export interface MentoringMaterial {
  id: string;
  enrollment_id?: string;
  enrollmentId?: string; // Alias para compatibilidade
  session_id?: string;
  sessionId?: string; // Alias para compatibilidade
  file_name: string;
  fileName?: string; // Alias para compatibilidade
  file_url: string;
  fileUrl?: string; // Alias para compatibilidade
  file_type: string;
  fileType?: string; // Alias para compatibilidade
  type?: string; // Added for compatibility
  description?: string;
  uploader_id?: string;
  uploaderId?: string; // Alias para compatibilidade
  uploader_type?: string;
  uploaderType?: string; // Alias para compatibilidade
  size_mb?: number;
  sizeMb?: number; // Alias para compatibilidade
  sizeMB?: number; // Alias para compatibility with existing code
  tags?: string[];
  created_at: string;
  createdAt?: string; // Alias para compatibilidade
  updated_at: string;
  updatedAt?: string; // Alias para compatibilidade
}

export type MentoringStatus = 'ativa' | 'concluida' | 'pausada' | 'cancelada';
export type SessionStatus = 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento' | 'no_show_aluno' | 'no_show_mentor' | 'reagendada';
export type PaymentStatus = 'pago' | 'pendente' | 'atrasado' | 'cancelado';
export type MentoringType = 'Individual' | 'Grupo';


