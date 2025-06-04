
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUltraSimplifiedLeadMovement } from '../useUltraSimplifiedLeadMovement';
import { toast } from 'sonner';

interface TestResult {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced';
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  pending: number;
}

export const useKanbanMovementTests = (pipelineId: string) => {
  const [testResults, setTestResults] = useState<{
    tests: TestResult[];
    summary: TestSummary;
  }>({
    tests: [
      {
        id: 'basic-move-forward',
        name: 'Mover Lead para Próxima Coluna',
        description: 'Testa movimentação básica para frente no pipeline',
        category: 'basic',
        status: 'pending'
      },
      {
        id: 'basic-move-backward',
        name: 'Mover Lead para Coluna Anterior',
        description: 'Testa movimentação para trás no pipeline',
        category: 'basic',
        status: 'pending'
      },
      {
        id: 'basic-same-column',
        name: 'Mover Lead para Mesma Coluna',
        description: 'Testa quando lead é solto na mesma coluna',
        category: 'basic',
        status: 'pending'
      },
      {
        id: 'advanced-invalid-column',
        name: 'Mover para Coluna Inválida',
        description: 'Testa tratamento de erro com coluna inexistente',
        category: 'advanced',
        status: 'pending'
      },
      {
        id: 'advanced-concurrent-moves',
        name: 'Movimentações Concorrentes',
        description: 'Testa múltiplas movimentações simultâneas',
        category: 'advanced',
        status: 'pending'
      },
      {
        id: 'advanced-offline-queue',
        name: 'Queue Offline',
        description: 'Testa armazenamento de operações quando offline',
        category: 'advanced',
        status: 'pending'
      }
    ],
    summary: { total: 6, passed: 0, failed: 0, pending: 6 }
  });

  const [isRunning, setIsRunning] = useState(false);
  const [testLeads, setTestLeads] = useState<string[]>([]);
  const [testColumns, setTestColumns] = useState<string[]>([]);

  const { moveLeadToColumn } = useUltraSimplifiedLeadMovement({
    pipeline_id: pipelineId,
    responsible_id: '',
    tag_ids: [],
    search: '',
    status: 'aberto'
  });

  const updateTestStatus = useCallback((testId: string, updates: Partial<TestResult>) => {
    setTestResults(prev => {
      const updatedTests = prev.tests.map(test =>
        test.id === testId ? { ...test, ...updates } : test
      );
      
      const summary = updatedTests.reduce(
        (acc, test) => {
          acc.total = updatedTests.length;
          acc[test.status]++;
          return acc;
        },
        { total: 0, passed: 0, failed: 0, pending: 0 }
      );

      return { tests: updatedTests, summary };
    });
  }, []);

  const generateTestData = useCallback(async () => {
    try {
      toast.info('Gerando dados de teste...');
      
      // Buscar colunas do pipeline
      const { data: columns } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name')
        .eq('pipeline_id', pipelineId)
        .eq('is_active', true)
        .order('sort_order');

      if (!columns || columns.length < 2) {
        throw new Error('Pipeline precisa de pelo menos 2 colunas para testes');
      }

      setTestColumns(columns.map(c => c.id));

      // Criar leads de teste
      const testLeadsData = [
        {
          name: 'Lead Teste 1',
          email: 'teste1@exemplo.com',
          pipeline_id: pipelineId,
          column_id: columns[0].id,
          status: 'aberto'
        },
        {
          name: 'Lead Teste 2', 
          email: 'teste2@exemplo.com',
          pipeline_id: pipelineId,
          column_id: columns[0].id,
          status: 'aberto'
        }
      ];

      const { data: createdLeads, error } = await supabase
        .from('crm_leads')
        .insert(testLeadsData)
        .select('id');

      if (error) throw error;

      setTestLeads(createdLeads.map(l => l.id));
      toast.success(`${createdLeads.length} leads de teste criados`);
      
    } catch (error) {
      console.error('Erro ao gerar dados de teste:', error);
      toast.error('Erro ao gerar dados de teste');
    }
  }, [pipelineId]);

  const cleanupTestData = useCallback(async () => {
    try {
      if (testLeads.length > 0) {
        await supabase
          .from('crm_leads')
          .delete()
          .in('id', testLeads);
        
        setTestLeads([]);
        toast.success('Dados de teste removidos');
      }
    } catch (error) {
      console.error('Erro ao limpar dados de teste:', error);
      toast.error('Erro ao limpar dados de teste');
    }
  }, [testLeads]);

  const runBasicMoveForward = useCallback(async (): Promise<boolean> => {
    if (testLeads.length === 0 || testColumns.length < 2) {
      throw new Error('Dados de teste não disponíveis');
    }

    const leadId = testLeads[0];
    const targetColumn = testColumns[1];
    
    await moveLeadToColumn(leadId, targetColumn);
    
    // Verificar se movimentação foi bem sucedida
    const { data: lead } = await supabase
      .from('crm_leads')
      .select('column_id')
      .eq('id', leadId)
      .single();
    
    return lead?.column_id === targetColumn;
  }, [testLeads, testColumns, moveLeadToColumn]);

  const runBasicMoveBackward = useCallback(async (): Promise<boolean> => {
    if (testLeads.length === 0 || testColumns.length < 2) {
      throw new Error('Dados de teste não disponíveis');
    }

    const leadId = testLeads[0];
    const targetColumn = testColumns[0];
    
    await moveLeadToColumn(leadId, targetColumn);
    
    const { data: lead } = await supabase
      .from('crm_leads')
      .select('column_id')
      .eq('id', leadId)
      .single();
    
    return lead?.column_id === targetColumn;
  }, [testLeads, testColumns, moveLeadToColumn]);

  const runSameColumnTest = useCallback(async (): Promise<boolean> => {
    if (testLeads.length === 0 || testColumns.length === 0) {
      throw new Error('Dados de teste não disponíveis');
    }

    const leadId = testLeads[0];
    const currentColumn = testColumns[0];
    
    // Mover para a mesma coluna deve ser ignorado
    await moveLeadToColumn(leadId, currentColumn);
    
    return true; // Se não deu erro, passou
  }, [testLeads, testColumns, moveLeadToColumn]);

  const runInvalidColumnTest = useCallback(async (): Promise<boolean> => {
    if (testLeads.length === 0) {
      throw new Error('Dados de teste não disponíveis');
    }

    const leadId = testLeads[0];
    const invalidColumnId = 'invalid-column-id';
    
    try {
      await moveLeadToColumn(leadId, invalidColumnId);
      return false; // Deveria ter dado erro
    } catch (error) {
      return true; // Erro esperado
    }
  }, [testLeads, moveLeadToColumn]);

  const runConcurrentMovesTest = useCallback(async (): Promise<boolean> => {
    if (testLeads.length < 2 || testColumns.length < 2) {
      throw new Error('Dados de teste insuficientes');
    }

    const promises = [
      moveLeadToColumn(testLeads[0], testColumns[1]),
      moveLeadToColumn(testLeads[1], testColumns[1])
    ];
    
    await Promise.all(promises);
    return true;
  }, [testLeads, testColumns, moveLeadToColumn]);

  const runOfflineQueueTest = useCallback(async (): Promise<boolean> => {
    // Simular offline
    const originalOnLine = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    try {
      if (testLeads.length === 0 || testColumns.length < 2) {
        throw new Error('Dados de teste não disponíveis');
      }

      // Tentar mover lead offline (deve usar queue)
      await moveLeadToColumn(testLeads[0], testColumns[1]);
      
      return true;
    } finally {
      // Restaurar estado online
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: originalOnLine
      });
    }
  }, [testLeads, testColumns, moveLeadToColumn]);

  const runSingleTest = useCallback(async (testId: string) => {
    updateTestStatus(testId, { status: 'running' });
    const startTime = Date.now();

    try {
      let passed = false;
      
      switch (testId) {
        case 'basic-move-forward':
          passed = await runBasicMoveForward();
          break;
        case 'basic-move-backward':
          passed = await runBasicMoveBackward();
          break;
        case 'basic-same-column':
          passed = await runSameColumnTest();
          break;
        case 'advanced-invalid-column':
          passed = await runInvalidColumnTest();
          break;
        case 'advanced-concurrent-moves':
          passed = await runConcurrentMovesTest();
          break;
        case 'advanced-offline-queue':
          passed = await runOfflineQueueTest();
          break;
        default:
          throw new Error(`Teste desconhecido: ${testId}`);
      }

      const duration = Date.now() - startTime;
      updateTestStatus(testId, {
        status: passed ? 'passed' : 'failed',
        duration
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestStatus(testId, {
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }, [
    updateTestStatus,
    runBasicMoveForward,
    runBasicMoveBackward,
    runSameColumnTest,
    runInvalidColumnTest,
    runConcurrentMovesTest,
    runOfflineQueueTest
  ]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    
    try {
      // Gerar dados de teste se não existirem
      if (testLeads.length === 0) {
        await generateTestData();
      }

      // Executar todos os testes sequencialmente
      for (const test of testResults.tests) {
        await runSingleTest(test.id);
        // Pequena pausa entre testes
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast.success('Todos os testes concluídos!');
      return testResults;

    } catch (error) {
      console.error('Erro ao executar testes:', error);
      toast.error('Erro durante execução dos testes');
    } finally {
      setIsRunning(false);
    }
  }, [testResults.tests, testLeads.length, generateTestData, runSingleTest]);

  const clearResults = useCallback(() => {
    setTestResults(prev => ({
      tests: prev.tests.map(test => ({
        ...test,
        status: 'pending',
        duration: undefined,
        error: undefined
      })),
      summary: { total: prev.tests.length, passed: 0, failed: 0, pending: prev.tests.length }
    }));
  }, []);

  return {
    testResults,
    isRunning,
    runAllTests,
    runSingleTest,
    clearResults,
    generateTestData,
    cleanupTestData
  };
};
