
import { useQuery } from '@tanstack/react-query';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { mentoringQueryKeys } from './queryKeys';

const repository = new SupabaseMentoringRepository();

export const useMentoringReadQueries = () => {
  const useCatalogs = () => {
    return useQuery({
      queryKey: mentoringQueryKeys.catalogs(),
      queryFn: () => repository.getCatalogs(),
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });
  };

  const useCatalogById = (id: string) => {
    return useQuery({
      queryKey: mentoringQueryKeys.catalog(id),
      queryFn: () => repository.getCatalogById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  const useEnrollments = () => {
    return useQuery({
      queryKey: mentoringQueryKeys.enrollments(),
      queryFn: () => repository.getEnrollments(),
      staleTime: 2 * 60 * 1000, // 2 minutos
    });
  };

  const useStudentEnrollments = (studentId: string) => {
    return useQuery({
      queryKey: mentoringQueryKeys.studentEnrollments(studentId),
      queryFn: () => repository.getStudentEnrollments(studentId),
      enabled: !!studentId,
      staleTime: 2 * 60 * 1000,
    });
  };

  const useSessions = () => {
    return useQuery({
      queryKey: mentoringQueryKeys.sessions(),
      queryFn: () => repository.getSessions(),
      staleTime: 1 * 60 * 1000, // 1 minuto
    });
  };

  const useEnrollmentSessions = (enrollmentId: string) => {
    return useQuery({
      queryKey: mentoringQueryKeys.enrollmentSessions(enrollmentId),
      queryFn: () => repository.getEnrollmentSessions(enrollmentId),
      enabled: !!enrollmentId,
      staleTime: 1 * 60 * 1000,
    });
  };

  return {
    useCatalogs,
    useCatalogById,
    useEnrollments,
    useStudentEnrollments,
    useSessions,
    useEnrollmentSessions,
  };
};
