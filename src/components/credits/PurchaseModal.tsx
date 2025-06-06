
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, Loader2 } from 'lucide-react';
import { PurchaseOption } from '@/types/credits.types';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (credits: number) => Promise<boolean>;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchase
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
      console.log('🛒 Iniciando compra no modal:', { credits });
      const success = await onPurchase(credits);
      
      if (success) {
        // Só fecha o modal se for uma compra simulada (demo)
        // Para compras reais, deixa aberto pois o usuário será redirecionado
        setTimeout(() => {
          setLoadingCredits(null);
          setIsLoading(false);
        }, 2000);
      } else {
        setLoadingCredits(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Erro na compra:', error);
      setLoadingCredits(null);
      setIsLoading(false);
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
