
import { IMentoringService, ValidationResult, EnrollmentProgress } from '../types/contracts.types';
import { 
  CreateMentoringCatalogData, 
  StudentMentoringEnrollment, 
  MentoringSession 
} from '@/types/mentoring.types';
import { IMentoringRepository } from '../types/contracts.types';

export class MentoringService implements IMentoringService {
  constructor(private repository: IMentoringRepository) {}

  async validateCatalogData(data: CreateMentoringCatalogData): Promise<ValidationResult> {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome é obrigatório');
    }

    if (!data.instructor || data.instructor.trim().length === 0) {
      errors.push('Instrutor é obrigatório');
    }

    if (data.price < 0) {
      errors.push('Preço deve ser positivo');
    }

    if (data.numberOfSessions <= 0) {
      errors.push('Número de sessões deve ser maior que zero');
    }

    if (data.durationMonths <= 0) {
      errors.push('Duração deve ser maior que zero');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculateEnrollmentProgress(enrollment: StudentMentoringEnrollment): EnrollmentProgress {
    const completedSessions = enrollment.sessionsUsed || 0;
    const totalSessions = enrollment.totalSessions;
    const scheduledSessions = 0; // This would need to be calculated from actual sessions data
    const pendingSessions = Math.max(0, totalSessions - completedSessions - scheduledSessions);
    const percentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    const daysRemaining = Math.ceil(
      (new Date(enrollment.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      percentage: Math.min(percentage, 100),
      completedSessions,
      sessionsUsed: completedSessions,
      totalSessions,
      pendingSessions,
      scheduledSessions,
      daysRemaining: Math.max(daysRemaining, 0),
      isExpired: daysRemaining < 0,
      isCompleted: completedSessions >= totalSessions
    };
  }

  async getUpcomingSessions(studentId: string): Promise<MentoringSession[]> {
    const enrollments = await this.repository.getStudentEnrollments(studentId);
    const enrollmentIds = enrollments.map(e => e.id);
    const allSessions = await this.repository.getSessions();
    
    return allSessions
      .filter(s => 
        enrollmentIds.includes(s.enrollmentId) && 
        s.status === 'agendada' &&
        new Date(s.scheduledDate) > new Date()
      )
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  canAddExtension(enrollment: StudentMentoringEnrollment): boolean {
    const maxExtensions = 3;
    const currentExtensions = enrollment.extensions?.length || 0;
    return currentExtensions < maxExtensions && enrollment.status === 'ativa';
  }
}
