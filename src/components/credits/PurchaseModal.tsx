
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { usePurchaseCredits } from '@/hooks/credits/usePurchaseCredits';
import { useCreditSettings } from '@/hooks/credits/useCreditSettings';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loadingCredits, setLoadingCredits] = useState<number | null>(null);
  const { purchaseCredits, isLoading } = usePurchaseCredits();
  const { creditSettings, isLoading: settingsLoading } = useCreditSettings();

  const handlePurchase = async (credits: number) => {
    setLoadingCredits(credits);
    
    try {
      console.log('🛒 Iniciando compra de créditos:', { credits });
      
      const result = await purchaseCredits(credits);
      
      if (result.success) {
        if (result.demo) {
          // Sucesso em modo demo
          onSuccess?.();
          onClose();
        } else if (result.redirected) {
          // Redirecionamento para Stripe - apenas fechar modal
          onClose();
        }
      } else {
        // Erro - mas não fazer nada extra, o hook já mostrou o toast
        console.log('❌ Compra não foi bem-sucedida');
      }

    } catch (err) {
      console.error('❌ Erro inesperado no modal:', err);
    } finally {
      setLoadingCredits(null);
    }
  };

  if (settingsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Carregando pacotes de créditos...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const packages = creditSettings?.packages || [];
  const systemSettings = creditSettings?.systemSettings;

  if (packages.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              Comprar Créditos Avulsos
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum pacote de créditos disponível no momento.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            Comprar Créditos Avulsos
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {packages.map((option) => (
            <Card 
              key={option.id} 
              className={`relative transition-all hover:shadow-lg ${
                option.is_popular ? 'border-blue-500 ring-2 ring-blue-200' : ''
              }`}
            >
              {option.is_popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Mais Popular
                </Badge>
              )}
              
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{option.credits}</h3>
                  <p className="text-sm text-gray-600">créditos</p>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {option.price.toFixed(2)}
                  </div>
                  {option.discount_percentage > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 line-through">
                        R$ {option.original_price.toFixed(2)}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        -{option.discount_percentage}%
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    R$ {(option.price / option.credits).toFixed(2)} por crédito
                  </p>
                </div>

                <Button
                  onClick={() => handlePurchase(option.credits)}
                  disabled={isLoading}
                  className="w-full"
                  variant={option.is_popular ? 'default' : 'outline'}
                >
                  {loadingCredits === option.credits ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Comprar Agora'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Créditos avulsos são adicionados ao seu saldo atual</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Créditos não expiram no final do mês</span>
          </div>
          {systemSettings?.enable_purchases === false && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span>Sistema em modo demonstração - compras desabilitadas pelo administrador</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
