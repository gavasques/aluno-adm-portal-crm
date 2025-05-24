
export interface MentoringCatalog {
  id: string;
  name: string;
  type: 'Individual' | 'Grupo' | 'Premium';
  instructor: string;
  durationWeeks: number;
  numberOfSessions: number;
  price: number;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentMentoringEnrollment {
  id: string;
  studentId: string;
  mentoringId: string;
  mentoring: MentoringCatalog;
  status: 'ativa' | 'concluida' | 'cancelada' | 'pausada';
  startDate: string;
  endDate: string;
  sessionsUsed: number;
  totalSessions: number;
  responsibleMentor: string;
  observations: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentoringSession {
  id: string;
  enrollmentId: string;
  enrollment?: StudentMentoringEnrollment;
  type: 'individual' | 'grupo';
  title: string;
  scheduledDate: string;
  durationMinutes: number;
  accessLink?: string;
  recordingLink?: string;
  status: 'agendada' | 'realizada' | 'cancelada' | 'reagendada';
  mentorNotes?: string;
  studentNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentoringMaterial {
  id: string;
  sessionId?: string;
  enrollmentId?: string;
  session?: MentoringSession;
  enrollment?: StudentMentoringEnrollment;
  fileName: string;
  storagePath: string;
  fileType: string;
  sizeMB: number;
  uploaderId: string;
  uploaderType: 'admin' | 'mentor' | 'aluno';
  description?: string;
  tags: string[];
  createdAt: string;
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
  type: 'Individual' | 'Grupo' | 'Premium';
  instructor: string;
  durationWeeks: number;
  numberOfSessions: number;
  price: number;
  description: string;
  active?: boolean;
}

export interface CreateSessionData {
  enrollmentId: string;
  type: 'individual' | 'grupo';
  title: string;
  scheduledDate: string;
  durationMinutes: number;
  accessLink?: string;
}

export interface UpdateSessionData extends Partial<CreateSessionData> {
  status?: 'agendada' | 'realizada' | 'cancelada' | 'reagendada';
  mentorNotes?: string;
  studentNotes?: string;
  recordingLink?: string;
}
