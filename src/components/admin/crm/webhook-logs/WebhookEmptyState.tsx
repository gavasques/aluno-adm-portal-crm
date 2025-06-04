
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, TestTube, ExternalLink } from 'lucide-react';

interface WebhookEmptyStateProps {
  onTest?: () => void;
}

export const WebhookEmptyState = ({ onTest }: WebhookEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Globe className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h4 className="text-xl font-medium text-gray-900 mb-2">
          Nenhum log de webhook encontrado
        </h4>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Ainda não há registros de webhooks para os filtros selecionados. 
          Os logs aparecerão aqui quando os webhooks forem executados.
        </p>
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onTest}
              className="gap-2"
            >
              <TestTube className="h-4 w-4" />
              Testar Webhook
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open('https://docs.lovable.dev', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Ver Documentação
            </Button>
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>💡 Use o botão "Testar Webhook" para simular uma requisição</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
