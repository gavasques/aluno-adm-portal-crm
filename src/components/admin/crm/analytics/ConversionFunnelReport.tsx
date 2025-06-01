
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, ArrowDown } from 'lucide-react';

interface FunnelStageData {
  stage: string;
  leads_count: number;
  conversion_rate: number;
  drop_rate: number;
}

interface ConversionFunnelReportProps {
  data: FunnelStageData[];
}

export const ConversionFunnelReport: React.FC<ConversionFunnelReportProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(stage => stage.leads_count));

  const getDropRateColor = (dropRate: number) => {
    if (dropRate <= 20) return 'bg-green-100 text-green-800';
    if (dropRate <= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais do Funil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão Geral</p>
              <p className="text-3xl font-bold text-blue-600">
                {data.length > 0 ? data[data.length - 1].conversion_rate.toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                De {data.length > 0 ? data[0].leads_count : 0} leads iniciais
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Maior Gargalo</p>
              <p className="text-3xl font-bold text-red-600">
                {Math.max(...data.map(stage => stage.drop_rate)).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Perda entre etapas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Leads Convertidos</p>
              <p className="text-3xl font-bold text-green-600">
                {data.length > 0 ? data[data.length - 1].leads_count : 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Fechamentos realizados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualização do Funil */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>
            Análise detalhada do fluxo de leads através do pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.map((stage, index) => {
              const widthPercentage = (stage.leads_count / maxCount) * 100;
              const isLast = index === data.length - 1;
              
              return (
                <div key={index} className="space-y-3">
                  {/* Estágio do Funil */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                        <p className="text-sm text-gray-500">
                          {stage.leads_count.toLocaleString()} leads • {stage.conversion_rate.toFixed(1)}% do total
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {stage.drop_rate > 0 && (
                        <Badge className={getDropRateColor(stage.drop_rate)}>
                          <TrendingDown className="h-3 w-3 mr-1" />
                          -{stage.drop_rate.toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Barra do Funil */}
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-12 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-4 transition-all duration-500"
                        style={{ width: `${widthPercentage}%` }}
                      >
                        <span className="text-white font-medium text-sm">
                          {stage.leads_count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seta para próximo estágio */}
                  {!isLast && (
                    <div className="flex justify-center">
                      <ArrowDown className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Oportunidades</CardTitle>
          <CardDescription>
            Análises automáticas baseadas nos dados do funil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Identificar maior gargalo */}
            {(() => {
              const maxDropStage = data.reduce((max, stage, index) => 
                stage.drop_rate > max.drop_rate ? { ...stage, index } : max, 
                { drop_rate: 0, stage: '', index: 0, leads_count: 0, conversion_rate: 0 }
              );
              
              if (maxDropStage.drop_rate > 0) {
                return (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <TrendingDown className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Maior Gargalo Identificado</h4>
                        <p className="text-sm text-red-700 mt-1">
                          A etapa "{maxDropStage.stage}" apresenta a maior perda ({maxDropStage.drop_rate.toFixed(1)}%). 
                          Considere revisar os processos e qualificação nesta fase.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Oportunidade de melhoria */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs">💡</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Oportunidade</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Melhorando a conversão em 5% na primeira etapa, você poderia gerar aproximadamente{' '}
                    {Math.round((data[0]?.leads_count || 0) * 0.05)} leads adicionais por período.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
