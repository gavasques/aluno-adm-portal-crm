
import { toast } from 'sonner';
import { CRMMetrics, PipelineMetrics, ResponsibleMetrics, LeadsByPeriod } from './useCRMReports';

export const useCRMReportsExport = () => {
  const exportReport = (
    metrics?: CRMMetrics,
    pipelineMetrics?: PipelineMetrics[],
    responsibleMetrics?: ResponsibleMetrics[],
    periodData?: LeadsByPeriod[]
  ) => {
    try {
      // Simular exportação
      const data = {
        metrics,
        pipelineMetrics,
        responsibleMetrics,
        periodData,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crm-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    }
  };

  return { exportReport };
};
