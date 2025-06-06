
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PurchaseOption {
  credits: number;
  price: number;
  originalPrice: number;
  discount?: number;
  popular?: boolean;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCredits, setLoadingCredits] = useState<number | null>(null);

  const purchaseOptions: PurchaseOption[] = [
    { credits: 10, price: 10.00, originalPrice: 10.00 },
    { credits: 20, price: 20.00, originalPrice: 20.00 },
    { credits: 50, price: 45.00, originalPrice: 50.00, discount: 10, popular: true },
    { credits: 100, price: 80.00, originalPrice: 100.00, discount: 20 },
    { credits: 200, price: 140.00, originalPrice: 200.00, discount: 30 },
    { credits: 500, price: 300.00, originalPrice: 500.00, discount: 40 },
  ];

  const handlePurchase = async (credits: number) => {
    setIsLoading(true);
    setLoadingCredits(credits);
    
    try {
      console.log('🛒 Iniciando compra de créditos:', { credits });
      
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { credits }
      });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        toast.error(`Erro ao processar compra: ${error.message}`);
        return;
      }

      if (data?.error) {
        console.error('❌ Erro retornado pela função:', data.error);
        toast.error(data.error);
        return;
      }

      if (data?.demo) {
        console.log('✅ Compra simulada realizada');
        toast.success(`Compra simulada: ${credits} créditos adicionados! (Modo demonstração)`);
        onSuccess?.();
        onClose();
        return;
      }

      if (data?.url) {
        console.log('✅ Redirecionando para checkout do Stripe');
        toast.success('Redirecionando para o pagamento...');
        window.open(data.url, '_blank');
        return;
      }

      console.warn('⚠️ Resposta inesperada:', data);
      toast.error('Resposta inesperada do servidor');

    } catch (err) {
      console.error('❌ Erro ao processar compra:', err);
      toast.error('Erro ao processar compra de créditos');
    } finally {
      setIsLoading(false);
      setLoadingCredits(null);
    }
  };

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
          {purchaseOptions.map((option) => (
            <Card 
              key={option.credits} 
              className={`relative transition-all hover:shadow-lg ${
                option.popular ? 'border-blue-500 ring-2 ring-blue-200' : ''
              }`}
            >
              {option.popular && (
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
                  {option.discount && (
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 line-through">
                        R$ {option.originalPrice.toFixed(2)}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        -{option.discount}%
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
                  variant={option.popular ? 'default' : 'outline'}
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

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Dica:</strong> Créditos avulsos são adicionados ao seu saldo atual e não expiram no final do mês.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
