
export const mentoringQueryKeys = {
  all: ['mentoring'] as const,
  catalogs: () => [...mentoringQueryKeys.all, 'catalogs'] as const,
  catalog: (id: string) => [...mentoringQueryKeys.catalogs(), id] as const,
  enrollments: () => [...mentoringQueryKeys.all, 'enrollments'] as const,
  studentEnrollments: (studentId: string) => [...mentoringQueryKeys.enrollments(), 'student', studentId] as const,
  sessions: () => [...mentoringQueryKeys.all, 'sessions'] as const,
  enrollmentSessions: (enrollmentId: string) => [...mentoringQueryKeys.sessions(), 'enrollment', enrollmentId] as const,
  materials: () => [...mentoringQueryKeys.all, 'materials'] as const,
  enrollmentMaterials: (enrollmentId: string) => [...mentoringQueryKeys.materials(), 'enrollment', enrollmentId] as const,
};
