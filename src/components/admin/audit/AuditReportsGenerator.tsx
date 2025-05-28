import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuditLogs, AuditFilters } from '@/hooks/admin/useAuditLogs';
import { useAuditAnalytics } from '@/hooks/admin/useAuditAnalytics';
import { toast } from 'sonner';

interface ReportConfig {
  name: string;
  description: string;
  dateRange: { from: string; to: string };
  includeMetrics: boolean;
  includeAnalytics: boolean;
  includeLogs: boolean;
  includeAlerts: boolean;
  filters: AuditFilters;
  format: 'json' | 'csv' | 'pdf';
}

export const AuditReportsGenerator: React.FC = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    includeMetrics: true,
    includeAnalytics: true,
    includeLogs: false,
    includeAlerts: true,
    filters: {},
    format: 'json'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: '1',
      name: 'Relatório Semanal de Segurança',
      schedule: 'Toda segunda-feira às 09:00',
      lastGenerated: '2024-01-22T09:00:00',
      status: 'active'
    },
    {
      id: '2',
      name: 'Relatório Mensal Executivo',
      schedule: 'Todo dia 1 às 08:00',
      lastGenerated: '2024-01-01T08:00:00',
      status: 'active'
    }
  ]);

  const { logs } = useAuditLogs(reportConfig.filters);
  const { analytics } = useAuditAnalytics(reportConfig.dateRange);

  const generateReport = async () => {
    if (!reportConfig.name.trim()) {
      toast.error('Por favor, insira um nome para o relatório');
      return;
    }

    setIsGenerating(true);

    try {
      const reportData: any = {
        metadata: {
          name: reportConfig.name,
          description: reportConfig.description,
          generated_at: new Date().toISOString(),
          date_range: reportConfig.dateRange,
          filters: reportConfig.filters,
          format: reportConfig.format
        }
      };

      if (reportConfig.includeMetrics && analytics) {
        reportData.metrics = {
          system_health: analytics.systemHealth,
          risk_analysis: analytics.riskAnalysis
        };
      }

      if (reportConfig.includeAnalytics && analytics) {
        reportData.analytics = {
          trends: analytics.trendsData,
          user_activity: analytics.userActivity,
          top_issues: analytics.topIssues
        };
      }

      if (reportConfig.includeLogs) {
        reportData.logs = logs.slice(0, 1000); // Limitar a 1000 logs
      }

      if (reportConfig.includeAlerts) {
        // Simular dados de alertas
        reportData.alerts = [
          {
            type: 'Multiple failed login attempts',
            severity: 'high',
            count: 5,
            last_occurrence: new Date().toISOString()
          }
        ];
      }

      // Gerar arquivo
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (reportConfig.format) {
        case 'json':
          content = JSON.stringify(reportData, null, 2);
          filename = `${reportConfig.name.replace(/\s+/g, '_')}_${reportConfig.dateRange.from}_${reportConfig.dateRange.to}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          // Converter logs para CSV
          if (reportConfig.includeLogs && logs.length > 0) {
            const headers = Object.keys(logs[0]).join(',');
            const rows = logs.map(log => 
              Object.values(log).map(value => 
                typeof value === 'string' ? `"${value}"` : value
              ).join(',')
            );
            content = [headers, ...rows].join('\n');
          } else {
            content = 'No data available for CSV export';
          }
          filename = `${reportConfig.name.replace(/\s+/g, '_')}_${reportConfig.dateRange.from}_${reportConfig.dateRange.to}.csv`;
          mimeType = 'text/csv';
          break;
        default:
          content = JSON.stringify(reportData, null, 2);
          filename = `${reportConfig.name.replace(/\s+/g, '_')}_${reportConfig.dateRange.from}_${reportConfig.dateRange.to}.json`;
          mimeType = 'application/json';
      }

      // Download do arquivo
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerador de Relatórios</h1>
          <p className="text-gray-600">Crie relatórios personalizados de auditoria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração do Relatório */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Configurar Relatório
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reportName">Nome do Relatório</Label>
              <Input
                id="reportName"
                value={reportConfig.name}
                onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Relatório de Segurança Semanal"
              />
            </div>

            <div>
              <Label htmlFor="reportDescription">Descrição</Label>
              <Textarea
                id="reportDescription"
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o propósito deste relatório..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={reportConfig.dateRange.from}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, from: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label>Data Fim</Label>
                <Input
                  type="date"
                  value={reportConfig.dateRange.to}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, to: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div>
              <Label>Formato do Relatório</Label>
              <Select
                value={reportConfig.format}
                onValueChange={(value: 'json' | 'csv' | 'pdf') => 
                  setReportConfig(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF (Em breve)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Conteúdo do Relatório</Label>
              <div className="space-y-2 mt-2">
                {[
                  { key: 'includeMetrics', label: 'Métricas do Sistema' },
                  { key: 'includeAnalytics', label: 'Analytics e Tendências' },
                  { key: 'includeLogs', label: 'Logs de Auditoria (últimos 1000)' },
                  { key: 'includeAlerts', label: 'Alertas de Segurança' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={reportConfig[key as keyof ReportConfig] as boolean}
                      onCheckedChange={(checked) => 
                        setReportConfig(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={generateReport} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Relatórios Agendados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Relatórios Agendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledReports.map((report) => (
                <div key={report.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{report.name}</h4>
                    <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                      {report.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{report.schedule}</p>
                  <p className="text-xs text-gray-500">
                    Último: {new Date(report.lastGenerated).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Novo Relatório
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
