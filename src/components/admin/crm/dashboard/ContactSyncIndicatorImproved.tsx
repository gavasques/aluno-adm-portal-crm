
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, Clock, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRMContactSyncImproved } from '@/hooks/crm/useCRMContactSyncImproved';

export const ContactSyncIndicatorImproved: React.FC = () => {
  const { 
    inconsistencies, 
    isLoading, 
    hasInconsistencies,
    syncAll, 
    updateOverdue,
    isSyncing,
    isUpdatingOverdue
  } = useCRMContactSyncImproved();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <Alert className="border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertDescription className="text-blue-800">
            Verificando sincronização de contatos...
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (!hasInconsistencies) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4"
      >
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-green-800">
              Todos os contatos estão sincronizados corretamente
            </span>
            <Button
              onClick={updateOverdue}
              disabled={isUpdatingOverdue}
              size="sm"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100 ml-4"
            >
              {isUpdatingOverdue ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Verificar Vencidos
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4"
      >
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-orange-800">
                {inconsistencies.length} lead(s) com contatos não sincronizados
              </span>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                {inconsistencies.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={updateOverdue}
                disabled={isUpdatingOverdue || isSyncing}
                size="sm"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                {isUpdatingOverdue ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Verificar Vencidos
                  </>
                )}
              </Button>
              <Button
                onClick={syncAll}
                disabled={isSyncing || isUpdatingOverdue}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar Agora
                  </>
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        
        {/* Lista detalhada das inconsistências */}
        {inconsistencies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 bg-white border border-orange-200 rounded-lg p-3"
          >
            <div className="text-sm font-medium text-orange-800 mb-2">
              Leads com inconsistências:
            </div>
            <div className="space-y-1">
              {inconsistencies.slice(0, 5).map((item) => (
                <div key={item.lead_id} className="text-xs text-gray-700 flex justify-between">
                  <span className="font-medium">{item.lead_name}</span>
                  <span className="text-gray-500">
                    Agendado: {item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString('pt-BR') : 'Nenhum'} | 
                    Real: {item.actual_next_contact ? new Date(item.actual_next_contact).toLocaleDateString('pt-BR') : 'Nenhum'}
                  </span>
                </div>
              ))}
              {inconsistencies.length > 5 && (
                <div className="text-xs text-gray-500 text-center pt-1">
                  ... e mais {inconsistencies.length - 5} lead(s)
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
