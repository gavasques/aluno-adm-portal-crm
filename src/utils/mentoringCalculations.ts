
export const calculateSessionsFromFrequency = (durationMonths: number, frequency: 'Semanal' | 'Quinzenal' | 'Mensal'): number => {
  if (!durationMonths || durationMonths <= 0) return 0;
  
  switch (frequency) {
    case 'Semanal':
      return durationMonths * 4; // Exatamente 4 semanas por mês
    case 'Quinzenal':
      return durationMonths * 2; // 2 quinzenas por mês
    case 'Mensal':
      return durationMonths; // 1 sessão por mês
    default:
      return 0;
  }
};

export const calculateEndDate = (startDate: string, totalMonths: number): string => {
  if (!startDate || !totalMonths) return '';
  
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return '';
  
  // Adiciona os meses
  const endDate = new Date(start);
  endDate.setMonth(endDate.getMonth() + totalMonths);
  
  // Pega o último dia do mês
  const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
  
  return lastDayOfMonth.toISOString().split('T')[0];
};

export const getFrequencyLabel = (frequency: 'Semanal' | 'Quinzenal' | 'Mensal'): string => {
  switch (frequency) {
    case 'Semanal':
      return 'Semanal (toda semana)';
    case 'Quinzenal':
      return 'Quinzenal (a cada 15 dias)';
    case 'Mensal':
      return 'Mensal (1x por mês)';
    default:
      return frequency;
  }
};
