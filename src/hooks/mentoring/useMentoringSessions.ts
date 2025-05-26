
import { useState, useEffect } from 'react';
import { MentoringSession, CreateSessionData, UpdateSessionData } from '@/types/mentoring.types';
import { MentoringDataService } from '@/services/mentoring/MentoringDataService';

const dataService = new MentoringDataService();

export const useMentoringSessions = () => {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshSessions = () => {
    setSessions(dataService.getSessions());
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  const getSessionDetails = (sessionId: string) => {
    return sessions.find(session => session.id === sessionId);
  };

  const getEnrollmentSessions = (enrollmentId: string) => {
    return sessions.filter(session => session.enrollmentId === enrollmentId);
  };

  const getUpcomingSessions = (studentId: string) => {
    const studentEnrollments = dataService.getEnrollments().filter(e => e.studentId === studentId);
    const enrollmentIds = studentEnrollments.map(e => e.id);
    
    return sessions.filter(session => 
      enrollmentIds.includes(session.enrollmentId) && 
      session.status === 'agendada' &&
      session.scheduledDate &&
      new Date(session.scheduledDate) > new Date()
    ).sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
  };

  const createSession = async (data: CreateSessionData) => {
    setLoading(true);
    try {
      const newSession = dataService.createSession(data);
      refreshSessions();
      return newSession;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (sessionId: string, data: UpdateSessionData) => {
    setLoading(true);
    try {
      const success = dataService.updateSession(sessionId, data);
      if (success) {
        refreshSessions();
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    loading,
    getSessionDetails,
    getEnrollmentSessions,
    getUpcomingSessions,
    createSession,
    updateSession,
    refreshSessions
  };
};
