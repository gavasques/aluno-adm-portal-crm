
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial,
  CreateMentoringCatalogData,
  CreateSessionData,
  CreateExtensionData,
  UpdateSessionData
} from '@/types/mentoring.types';

export interface IMentoringRepository {
  // Catalog operations
  getCatalogs(): Promise<MentoringCatalog[]>;
  getCatalogById(id: string): Promise<MentoringCatalog | null>;
  createCatalog(data: CreateMentoringCatalogData): Promise<MentoringCatalog>;
  updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean>;
  deleteCatalog(id: string): Promise<boolean>;

  // Enrollment operations
  getEnrollments(): Promise<StudentMentoringEnrollment[]>;
  getStudentEnrollments(studentId: string): Promise<StudentMentoringEnrollment[]>;
  createEnrollment(data: any): Promise<StudentMentoringEnrollment>;
  deleteEnrollment(id: string): Promise<boolean>;
  addExtension(data: CreateExtensionData): Promise<boolean>;
  removeExtension(extensionId: string): Promise<boolean>;

  // Session operations
  getSessions(): Promise<MentoringSession[]>;
  getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]>;
  createSession(data: CreateSessionData): Promise<MentoringSession>;
  updateSession(sessionId: string, data: UpdateSessionData): Promise<boolean>;
  deleteSession(sessionId: string): Promise<boolean>;

  // Material operations
  getMaterials(): Promise<MentoringMaterial[]>;
  getEnrollmentMaterials(enrollmentId: string): Promise<MentoringMaterial[]>;
  getSessionMaterials(sessionId: string): Promise<MentoringMaterial[]>;
  uploadMaterial(file: File, enrollmentId?: string, sessionId?: string): Promise<MentoringMaterial>;
}

export interface IMentoringService {
  // Business logic operations
  validateCatalogData(data: CreateMentoringCatalogData): Promise<ValidationResult>;
  calculateEnrollmentProgress(enrollment: StudentMentoringEnrollment): EnrollmentProgress;
  getUpcomingSessions(studentId: string): Promise<MentoringSession[]>;
  canAddExtension(enrollment: StudentMentoringEnrollment): boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EnrollmentProgress {
  percentage: number;
  completedSessions: number;
  sessionsUsed: number;
  totalSessions: number;
  pendingSessions: number;
  scheduledSessions: number;
  daysRemaining: number;
  isExpired: boolean;
  isCompleted: boolean;
}

export interface MentoringFilters {
  status?: string;
  type?: string;
  search?: string;
  instructor?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface MentoringOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
