
import { CRMMetrics, PipelineMetrics, ResponsibleMetrics, LeadsByPeriod } from './useCRMReports';

export const useCRMReportsExport = () => {
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportReport = (
    metrics?: CRMMetrics,
    pipelineMetrics?: PipelineMetrics[],
    responsibleMetrics?: ResponsibleMetrics[],
    periodData?: LeadsByPeriod[]
  ) => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Exportar métricas gerais
    if (metrics) {
      const metricsData = [{
        'Total de Leads': metrics.totalLeads,
        'Leads Convertidos': metrics.convertedLeads,
        'Taxa de Conversão (%)': metrics.conversionRate.toFixed(2),
        'Leads Este Mês': metrics.leadsThisMonth,
        'Leads Mês Anterior': metrics.leadsLastMonth,
        'Crescimento Mensal (%)': metrics.monthlyGrowth.toFixed(2)
      }];
      exportToCSV(metricsData, `crm-metricas-gerais-${timestamp}`);
    }

    // Exportar métricas por responsável
    if (responsibleMetrics && responsibleMetrics.length > 0) {
      const responsibleData = responsibleMetrics.map(r => ({
        'Responsável': r.responsibleName,
        'Total de Leads': r.totalLeads,
        'Leads Convertidos': r.convertedLeads,
        'Taxa de Conversão (%)': r.conversionRate.toFixed(2)
      }));
      exportToCSV(responsibleData, `crm-performance-responsaveis-${timestamp}`);
    }

    // Exportar dados por período
    if (periodData && periodData.length > 0) {
      const periodDataFormatted = periodData.map(p => ({
        'Período': p.period,
        'Novos Leads': p.leads,
        'Convertidos': p.converted
      }));
      exportToCSV(periodDataFormatted, `crm-dados-periodo-${timestamp}`);
    }

    console.log('Relatórios exportados com sucesso!');
  };

  return {
    exportReport,
    exportToCSV
  };
};
