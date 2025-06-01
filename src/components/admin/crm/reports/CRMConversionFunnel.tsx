
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingDown, 
  Users, 
  Filter,
  ArrowRight,
  Percent
} from 'lucide-react';
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from 'recharts';

interface CRMConversionFunnelProps {
  timeRange: string;
}

const CRMConversionFunnel: React.FC<CRMConversionFunnelProps> = ({ timeRange }) => {
  const [selectedPipeline, setSelectedPipeline] = useState('all');

  const funnelData = [
    { name: 'Leads Capturados', value: 1500, fill: '#3b82f6' },
    { name: 'Leads Qualificados', value: 1200, fill: '#10b981' },
    { name: 'Apresentação', value: 800, fill: '#f59e0b' },
    { name: 'Proposta Enviada', value: 400, fill: '#f97316' },
    { name: 'Negociação', value: 200, fill: '#ef4444' },
    { name: 'Fechado', value: 120, fill: '#8b5cf6' }
  ];

  const conversionRates = [
    { from: 'Capturados', to: 'Qualificados', rate: 80.0, lost: 300 },
    { from: 'Qualificados', to: 'Apresentação', rate: 66.7, lost: 400 },
    { from: 'Apresentação', to: 'Proposta', rate: 50.0, lost: 400 },
    { from: 'Proposta', to: 'Negociação', rate: 50.0, lost: 200 },
    { from: 'Negociação', to: 'Fechado', rate: 60.0, lost: 80 }
  ];

  const pipelineComparison = [
    { pipeline: 'Pipeline Principal', leads: 1200, converted: 95, rate: 7.9 },
    { pipeline: 'Pipeline Corporativo', leads: 200, converted: 18, rate: 9.0 },
    { pipeline: 'Pipeline Indicações', leads: 100, converted: 7, rate: 7.0 }
  ];

  const lossReasons = [
    { reason: 'Não qualificado', count: 45, percentage: 35 },
    { reason: 'Preço alto', count: 32, percentage: 25 },
    { reason: 'Timing inadequado', count: 26, percentage: 20 },
    { reason: 'Concorrência', count: 19, percentage: 15 },
    { reason: 'Outros', count: 6, percentage: 5 }
  ];

  const StageCard = ({ stage, value, percentage, isLast = false }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">{stage.name}</h3>
            <p className="text-3xl font-bold text-blue-600">{value.toLocaleString()}</p>
            <Badge variant="outline" className="text-xs">
              {percentage}% do total
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {!isLast && (
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-white rounded-full p-2 shadow-lg border">
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Button
          variant={selectedPipeline === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPipeline('all')}
        >
          Todos os Pipelines
        </Button>
        <Button
          variant={selectedPipeline === 'main' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPipeline('main')}
        >
          Pipeline Principal
        </Button>
        <Button
          variant={selectedPipeline === 'corp' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPipeline('corp')}
        >
          Corporativo
        </Button>
      </div>

      {/* Funil visual */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Funil de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 items-center">
            {funnelData.map((stage, index) => {
              const percentage = ((stage.value / funnelData[0].value) * 100).toFixed(1);
              return (
                <StageCard
                  key={stage.name}
                  stage={stage}
                  value={stage.value}
                  percentage={percentage}
                  isLast={index === funnelData.length - 1}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taxas de conversão */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-green-600" />
              Taxas de Conversão por Etapa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionRates.map((rate, index) => (
                <motion.div
                  key={`${rate.from}-${rate.to}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {rate.from} → {rate.to}
                      </p>
                      <p className="text-sm text-gray-500">{rate.lost} leads perdidos</p>
                    </div>
                  </div>
                  <Badge 
                    variant={rate.rate > 60 ? 'default' : rate.rate > 40 ? 'secondary' : 'destructive'}
                    className="text-lg font-bold px-3 py-1"
                  >
                    {rate.rate}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivos de perda */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Principais Motivos de Perda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lossReasons.map((reason, index) => (
                <motion.div
                  key={reason.reason}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{reason.reason}</p>
                      <span className="text-sm text-gray-500">{reason.count} leads</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${reason.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-3">
                    {reason.percentage}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparação entre pipelines */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-600" />
            Comparação entre Pipelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pipelineComparison.map((pipeline, index) => (
              <motion.div
                key={pipeline.pipeline}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg"
              >
                <h3 className="font-semibold text-gray-900 mb-3">{pipeline.pipeline}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de Leads</span>
                    <span className="font-medium">{pipeline.leads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Convertidos</span>
                    <span className="font-medium">{pipeline.converted}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium text-gray-900">Taxa de Conversão</span>
                    <Badge variant={pipeline.rate > 8 ? 'default' : 'secondary'}>
                      {pipeline.rate}%
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMConversionFunnel;
