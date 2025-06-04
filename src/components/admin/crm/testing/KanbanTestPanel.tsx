
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Bug,
  Settings
} from 'lucide-react';
import { useKanbanMovementTests } from '@/hooks/crm/testing/useKanbanMovementTests';
import { motion, AnimatePresence } from 'framer-motion';

interface KanbanTestPanelProps {
  pipelineId: string;
  onTestComplete?: (results: any) => void;
}

export const KanbanTestPanel: React.FC<KanbanTestPanelProps> = ({
  pipelineId,
  onTestComplete
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    testResults,
    isRunning,
    runAllTests,
    runSingleTest,
    clearResults,
    generateTestData,
    cleanupTestData
  } = useKanbanMovementTests(pipelineId);

  const handleRunAllTests = async () => {
    const results = await runAllTests();
    if (onTestComplete) {
      onTestComplete(results);
    }
  };

  const getStatusIcon = (status: 'pending' | 'running' | 'passed' | 'failed') => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Teste de Movimentação no Kanban
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Simples' : 'Avançado'}
            </Button>
            <Button
              onClick={handleRunAllTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Executando...' : 'Executar Todos os Testes'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Geral */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(testResults.summary).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500 capitalize">
                {key === 'total' ? 'Total' : 
                 key === 'passed' ? 'Passou' : 
                 key === 'failed' ? 'Falhou' : 'Pendente'}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Testes Básicos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Testes Básicos de Movimentação</h3>
          <div className="grid gap-3">
            {testResults.tests
              .filter(test => test.category === 'basic')
              .map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-gray-500">{test.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(test.status)}>
                      {test.status === 'passed' ? 'Passou' :
                       test.status === 'failed' ? 'Falhou' :
                       test.status === 'running' ? 'Executando' : 'Pendente'}
                    </Badge>
                    
                    {test.duration && (
                      <span className="text-xs text-gray-400">
                        {test.duration}ms
                      </span>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => runSingleTest(test.id)}
                      disabled={isRunning}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Testes Avançados */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <Separator />
              <h3 className="text-lg font-semibold">Testes Avançados</h3>
              
              <div className="grid gap-3">
                {testResults.tests
                  .filter(test => test.category === 'advanced')
                  .map((test) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-gray-500">{test.description}</div>
                          {test.error && (
                            <div className="text-xs text-red-600 mt-1">
                              Erro: {test.error}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(test.status)}>
                          {test.status === 'passed' ? 'Passou' :
                           test.status === 'failed' ? 'Falhou' :
                           test.status === 'running' ? 'Executando' : 'Pendente'}
                        </Badge>
                        
                        {test.duration && (
                          <span className="text-xs text-gray-400">
                            {test.duration}ms
                          </span>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => runSingleTest(test.id)}
                          disabled={isRunning}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ações de Limpeza */}
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={generateTestData}
              disabled={isRunning}
            >
              Gerar Dados de Teste
            </Button>
            <Button
              variant="outline"
              onClick={cleanupTestData}
              disabled={isRunning}
            >
              Limpar Dados de Teste
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={clearResults}
            disabled={isRunning}
          >
            Limpar Resultados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
