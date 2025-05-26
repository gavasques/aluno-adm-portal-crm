
import { useState } from 'react';
import { MentoringCatalog } from '@/types/mentoring.types';

// Mock data com status corrigido
const mockMentoringCatalog: MentoringCatalog = {
  id: 'mentoring-001',
  name: 'E-commerce Strategy',
  type: 'Individual',
  instructor: 'Bianca Mentora',
  durationWeeks: 8,
  numberOfSessions: 12,
  totalSessions: 12,
  price: 299,
  description: 'Learn how to build a successful e-commerce strategy.',
  tags: ['ecommerce', 'strategy', 'business'],
  active: true,
  status: 'Ativa',
  createdAt: '2024-11-01T00:00:00Z',
  updatedAt: '2024-11-01T00:00:00Z'
};

export const useMentoring = () => {
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>([mockMentoringCatalog]);
  const [loading, setLoading] = useState(false);

  const createCatalog = async (data: any): Promise<MentoringCatalog> => {
    setLoading(true);
    try {
      const newCatalog: MentoringCatalog = {
        id: `catalog-${Date.now()}`,
        name: data.name,
        type: data.type,
        instructor: data.instructor,
        durationWeeks: data.durationWeeks,
        numberOfSessions: data.numberOfSessions,
        totalSessions: data.numberOfSessions,
        price: data.price,
        description: data.description,
        tags: [],
        active: data.active ?? true,
        status: data.status ?? 'Ativa',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCatalogs(prev => [...prev, newCatalog]);
      return newCatalog;
    } finally {
      setLoading(false);
    }
  };

  return {
    catalogs,
    loading,
    createCatalog
  };
};
