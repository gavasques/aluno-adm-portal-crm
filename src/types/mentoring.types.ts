
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
