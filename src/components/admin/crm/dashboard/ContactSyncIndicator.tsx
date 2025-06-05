
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRMContactSync } from '@/hooks/crm/useCRMContactSync';

export const ContactSyncIndicator: React.FC = () => {
  const { unsynced, isLoading, syncAll, isSyncing } = useCRMContactSync();

  // Não mostrar se não há leads para sincronizar
  if (isLoading || unsynced.length === 0) {
    return null;
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
                {unsynced.length} lead(s) com contatos pendentes não sincronizados
              </span>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                {unsynced.length}
              </Badge>
            </div>
            <Button
              onClick={syncAll}
              disabled={isSyncing}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white ml-4"
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
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};
