
import { useState, useEffect } from 'react';

interface Mentor {
  id: string;
  name: string;
  email: string;
}

export const useMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados de mentores - em produção seria uma API call
    const mockMentors: Mentor[] = [
      { id: '1', name: 'João Silva', email: 'joao@exemplo.com' },
      { id: '2', name: 'Maria Santos', email: 'maria@exemplo.com' },
      { id: '3', name: 'Pedro Costa', email: 'pedro@exemplo.com' },
      { id: '4', name: 'Ana Oliveira', email: 'ana@exemplo.com' }
    ];

    setTimeout(() => {
      setMentors(mockMentors);
      setLoading(false);
    }, 500);
  }, []);

  return { mentors, loading };
};
