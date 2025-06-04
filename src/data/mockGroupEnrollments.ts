
import { GroupEnrollment } from '@/types/mentoring.types';

export const mockGroupEnrollments: GroupEnrollment[] = [
  {
    id: '1',
    groupName: 'Turma Amazon FBA - Janeiro 2024',
    responsibleMentor: 'João Silva',
    status: 'ativa',
    mentoring: {
      id: 'ment-1',
      name: 'Amazon FBA Mastery',
      type: 'Grupo'
    },
    participants: [
      { id: 'p1', name: 'Maria Santos', email: 'maria@email.com' },
      { id: 'p2', name: 'Pedro Costa', email: 'pedro@email.com' },
      { id: 'p3', name: 'Ana Oliveira', email: 'ana@email.com' }
    ],
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    sessionsCompleted: 8,
    totalSessions: 12,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    groupName: 'Turma E-commerce Avançado - Fevereiro 2024',
    responsibleMentor: 'Carlos Mendes',
    status: 'concluida',
    mentoring: {
      id: 'ment-2',
      name: 'E-commerce Avançado',
      type: 'Grupo'
    },
    participants: [
      { id: 'p4', name: 'Lucas Ferreira', email: 'lucas@email.com' },
      { id: 'p5', name: 'Carla Lima', email: 'carla@email.com' }
    ],
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    sessionsCompleted: 15,
    totalSessions: 15,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    groupName: 'Turma Marketing Digital - Março 2024',
    responsibleMentor: 'Fernanda Rocha',
    status: 'pausada',
    mentoring: {
      id: 'ment-3',
      name: 'Marketing Digital',
      type: 'Grupo'
    },
    participants: [
      { id: 'p6', name: 'Roberto Silva', email: 'roberto@email.com' },
      { id: 'p7', name: 'Juliana Matos', email: 'juliana@email.com' },
      { id: 'p8', name: 'André Costa', email: 'andre@email.com' },
      { id: 'p9', name: 'Patricia Alves', email: 'patricia@email.com' }
    ],
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    sessionsCompleted: 5,
    totalSessions: 12,
    createdAt: '2024-02-15T00:00:00Z'
  }
];
