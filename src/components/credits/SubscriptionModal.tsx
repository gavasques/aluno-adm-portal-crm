
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Repeat, Check } from 'lucide-react';
import { SubscriptionPlan } from '@/types/credits.types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (monthlyCredits: number) => Promise<boolean>;
  currentSubscription?: { monthly_credits: number; status: string } | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  currentSubscription
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    { 
      monthlyCredits: 50, 
      price: 40.00, 
      description: 'Ideal para uso moderado' 
    },
    { 
      monthlyCredits: 100, 
      price: 70.00, 
      description: 'Perfeito para uso regular',
      popular: true 
    },
    { 
      monthlyCredits: 200, 
      price: 120.00, 
      description: 'Para uso intensivo' 
    },
  ];

  const handleSubscribe = async (monthlyCredits: number) => {
    setIsLoading(true);
    try {
      const success = await onSubscribe(monthlyCredits);
      if (success) {
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentPlan = (monthlyCredits: number) => {
    return currentSubscription?.monthly_credits === monthlyCredits && 
           currentSubscription?.status === 'active';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-6 w-6 text-yellow-600" />
            Assinatura de Créditos Recorrentes
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.monthlyCredits} 
              className={`relative transition-all hover:shadow-lg ${
                plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : ''
              } ${
                isCurrentPlan(plan.monthlyCredits) ? 'border-green-500 ring-2 ring-green-200' : ''
              }`}
            >
              {plan.popular && !isCurrentPlan(plan.monthlyCredits) && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Recomendado
                </Badge>
              )}

              {isCurrentPlan(plan.monthlyCredits) && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  Plano Atual
                </Badge>
              )}
              
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Repeat className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">+{plan.monthlyCredits}</h3>
                  <p className="text-sm text-gray-600">créditos/mês</p>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {plan.price.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    R$ {(plan.price / plan.monthlyCredits).toFixed(2)} por crédito
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    {plan.description}
                  </p>
                </div>

                <ul className="text-left text-sm text-gray-600 mb-4 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Renovação automática mensal
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Cancele quando quiser
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Sem compromisso de fidelidade
                  </li>
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.monthlyCredits)}
                  disabled={isLoading || isCurrentPlan(plan.monthlyCredits)}
                  className="w-full"
                  variant={plan.popular && !isCurrentPlan(plan.monthlyCredits) ? 'default' : 'outline'}
                >
                  {isCurrentPlan(plan.monthlyCredits) 
                    ? 'Plano Ativo' 
                    : isLoading 
                      ? 'Processando...' 
                      : 'Assinar Agora'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            🔄 <strong>Renovação Automática:</strong> Seus créditos da assinatura são adicionados automaticamente todo mês na data de renovação.
          </p>
        </div>

        {currentSubscription?.status === 'active' && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              ✅ Você já possui uma assinatura ativa de +{currentSubscription.monthly_credits} créditos/mês.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
