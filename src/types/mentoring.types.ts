
export interface MentoringCatalog {
  id: string;
  name: string;
  type: 'Individual' | 'Grupo';
  instructor: string;
  durationMonths: number;
  numberOfSessions: number;
  totalSessions: number;
  price: number;
  description: string;
  tags: string[];
  imageUrl?: string;
  active: boolean;
  status: 'Ativa' | 'Inativa' | 'Cancelada';
  createdAt: string;
  updatedAt: string;
  extensions?: MentoringExtensionOption[];
  checkoutLinks?: CheckoutLinks;
}

export interface CheckoutLinks {
  mercadoPago?: string;
  hubla?: string;
  hotmart?: string;
}

export interface MentoringExtensionOption {
  id: string;
  months: number;
  price: number;
  description?: string;
  checkoutLinks?: CheckoutLinks;
}

export interface MentoringExtension {
  id: string;
  enrollmentId: string;
  extensionMonths: number;
  appliedDate: string;
  notes?: string;
  adminId: string;
  createdAt: string;
}

export interface StudentMentoringEnrollment {
  id: string;
  studentId: string;
  mentoringId: string;
  mentoring: MentoringCatalog;
  status: 'ativa' | 'concluida' | 'cancelada' | 'pausada';
  enrollmentDate: string;
  startDate: string;
  endDate: string;
  originalEndDate?: string;
  sessionsUsed: number;
  totalSessions: number;
  responsibleMentor: string;
  paymentStatus: string;
  observations?: string;
  extensions?: MentoringExtension[];
  hasExtension?: boolean;
  createdAt: string;
  updatedAt: string;
  groupId?: string;
}

export interface GroupEnrollment {
  id: string;
  groupName: string;
  mentoring: MentoringCatalog;
  status: 'ativa' | 'concluida' | 'cancelada' | 'pausada';
  responsibleMentor: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  participants: StudentMentoringEnrollment[];
  createdAt: string;
  updatedAt: string;
}

export interface MentoringSession {
  id: string;
  enrollmentId: string;
  enrollment?: StudentMentoringEnrollment;
  sessionNumber: number;
  type: 'individual' | 'grupo';
  title: string;
  scheduledDate?: string;
  durationMinutes: number;
  status: 'aguardando_agendamento' | 'agendada' | 'realizada' | 'cancelada' | 'reagendada' | 'no_show_aluno' | 'no_show_mentor';
  calendlyLink?: string;
  meetingLink?: string;
  recordingLink?: string;
  mentorNotes?: string;
  studentNotes?: string;
  createdAt: string;
  updatedAt: string;
  groupId?: string;
}

export interface MentoringMaterial {
  id: string;
  sessionId?: string;
  enrollmentId?: string;
  session?: MentoringSession;
  enrollment?: StudentMentoringEnrollment;
  fileName: string;
  fileUrl: string;
  type: string;
  description?: string;
  storagePath?: string;
  fileType?: string;
  sizeMB?: number;
  uploaderId?: string;
  uploaderType?: 'admin' | 'mentor' | 'aluno';
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface MentoringStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedSessions: number;
  upcomingSessions: number;
  totalMaterials: number;
  averageRating: number;
}

export interface CreateMentoringCatalogData {
  name: string;
  type: 'Individual' | 'Grupo';
  instructor: string;
  durationMonths: number;
  numberOfSessions: number;
  price: number;
  description: string;
  active?: boolean;
  status?: 'Ativa' | 'Inativa' | 'Cancelada';
  extensions?: MentoringExtensionOption[];
  checkoutLinks?: CheckoutLinks;
}

export interface CreateSessionData {
  enrollmentId: string;
  type: 'individual' | 'grupo';
  title: string;
  scheduledDate?: string;
  durationMinutes: number;
  meetingLink?: string;
  groupId?: string;
}

export interface UpdateSessionData extends Partial<CreateSessionData> {
  status?: 'aguardando_agendamento' | 'agendada' | 'realizada' | 'cancelada' | 'reagendada' | 'no_show_aluno' | 'no_show_mentor';
  mentorNotes?: string;
  studentNotes?: string;
  recordingLink?: string;
  calendlyLink?: string;
  meetingLink?: string;
}

export interface CreateExtensionData {
  enrollmentId: string;
  extensionMonths: number;
  notes?: string;
}

export interface ScheduleSessionData {
  sessionId: string;
  scheduledDate: string;
  meetingLink?: string;
}

export interface EnrollmentProgress {
  completedSessions: number;
  sessionsUsed: number;
  totalSessions: number;
  pendingSessions: number;
  scheduledSessions: number;
  percentage: number;
  daysRemaining: number;
  isExpired: boolean;
  isCompleted: boolean;
}

// Session Status Types for UI components
export type SessionStatusFilter = 'cancelada' | 'agendada' | 'realizada' | 'reagendada' | 'ausente_aluno' | 'ausente_mentor' | 'aguardando_agendamento';
