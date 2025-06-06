
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Repeat, Check, Star, Loader2, AlertCircle } from 'lucide-react';
import { useCreditSettings } from '@/hooks/credits/useCreditSettings';
import { useSubscriptions } from '@/hooks/credits/useSubscriptions';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
  currentSubscription?: { monthly_credits: number; status: string } | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  currentSubscription
}) => {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const { creditSettings, isLoading: settingsLoading } = useCreditSettings();
  const { createSubscription } = useSubscriptions();

  const handleSubscribe = async (planId: string) => {
    setLoadingPlanId(planId);
    try {
      const result = await createSubscription(planId);
      if (result.success) {
        if (result.demo) {
          onSubscribe?.();
          onClose();
        } else if (result.redirected) {
          onClose();
        }
      }
    } finally {
      setLoadingPlanId(null);
    }
  };

  const isCurrentPlan = (monthlyCredits: number) => {
    return currentSubscription?.monthly_credits === monthlyCredits && 
           currentSubscription?.status === 'active';
  };

  if (settingsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Carregando planos de assinatura...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const subscriptionPlans = creditSettings?.subscriptionPlans || [];

  if (subscriptionPlans.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="h-6 w-6 text-yellow-600" />
              Assinatura de Créditos
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum plano disponível</h3>
            <p className="text-gray-600">Os planos de assinatura ainda não foram configurados.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Crown className="h-7 w-7 text-yellow-600" />
            </div>
            Assinatura de Créditos Recorrentes
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Receba créditos automaticamente todo mês
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.is_popular && !isCurrentPlan(plan.monthly_credits)
                  ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg' 
                  : isCurrentPlan(plan.monthly_credits)
                    ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg'
                    : 'border border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.is_popular && !isCurrentPlan(plan.monthly_credits) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Recomendado
                  </Badge>
                </div>
              )}

              {isCurrentPlan(plan.monthly_credits) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-4 py-1 flex items-center gap-1">
                    <Check className="h-3 w-3 fill-current" />
                    Plano Atual
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Repeat className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="text-3xl font-bold text-blue-600">+{plan.monthly_credits}</div>
                    <p className="text-sm text-gray-600">créditos/mês</p>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    R$ {plan.price.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500">
                    R$ {(plan.price / plan.monthly_credits).toFixed(2)} por crédito
                  </p>
                  {plan.description && (
                    <p className="text-sm text-blue-600 font-medium bg-blue-50 rounded-lg py-2 px-3 mt-3">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="mb-6 space-y-2">
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Renovação automática mensal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Cancele quando quiser</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Sem compromisso de fidelidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Créditos adicionais aos gratuitos</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loadingPlanId !== null || isCurrentPlan(plan.monthly_credits)}
                  className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                    isCurrentPlan(plan.monthly_credits)
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : plan.is_popular && !isCurrentPlan(plan.monthly_credits)
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {loadingPlanId === plan.id ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : isCurrentPlan(plan.monthly_credits) ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Plano Ativo
                    </>
                  ) : (
                    <>
                      <Crown className="h-5 w-5 mr-2" />
                      Assinar Agora
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl mt-6">
          <div className="text-center">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center justify-center gap-2">
              <Repeat className="h-5 w-5" />
              Como funciona a assinatura?
            </h4>
            <p className="text-sm text-blue-800">
              🔄 <strong>Renovação Automática:</strong> Seus créditos da assinatura são adicionados automaticamente todo mês na data de renovação, 
              somando aos seus créditos gratuitos mensais.
            </p>
          </div>
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
