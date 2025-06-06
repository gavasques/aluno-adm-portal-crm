
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Crown, RefreshCw, Loader2 } from 'lucide-react';
import { CreditDisplay } from '@/components/credits/CreditDisplay';
import { PurchaseModal } from '@/components/credits/PurchaseModal';
import { SubscriptionModal } from '@/components/credits/SubscriptionModal';
import { CreditHistory } from '@/components/credits/CreditHistory';
import { useCredits } from '@/hooks/useCredits';
import { toast } from 'sonner';

const StudentCredits = () => {
  const { 
    creditStatus, 
    isLoading, 
    error, 
    refreshCredits, 
    purchaseCredits, 
    subscribeCredits 
  } = useCredits();

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  console.log("=== STUDENT CREDITS DEBUG ===");
  console.log("Credit Status:", creditStatus);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);
  console.log("=============================");

  const handleRefresh = async () => {
    try {
      await refreshCredits();
      toast.success('Informações atualizadas com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar créditos:', err);
      toast.error('Erro ao atualizar informações');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Carregando informações de créditos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !creditStatus) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Créditos</h1>
          <p className="text-gray-600">Gerencie seus créditos e assinaturas</p>
        </div>

        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">
              {error || 'Erro ao carregar informações de créditos'}
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Usar dados padrão se não tiver creditStatus mas não houver erro
  const safeCredits = creditStatus?.credits || {
    current: 0,
    used: 0,
    limit: 50,
    renewalDate: new Date().toISOString().split('T')[0],
    usagePercentage: 0
  };

  const safeTransactions = creditStatus?.transactions || [];
  const safeSubscription = creditStatus?.subscription || null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Créditos</h1>
          <p className="text-gray-600">Gerencie seus créditos e assinaturas</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Alert de erro se houver mas ainda tiver dados */}
      {error && creditStatus && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ Alguns dados podem estar desatualizados: {error}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="xl:col-span-2 space-y-6">
          {/* Display de Créditos */}
          <CreditDisplay
            current={safeCredits.current}
            used={safeCredits.used}
            limit={safeCredits.limit}
            renewalDate={safeCredits.renewalDate}
            usagePercentage={safeCredits.usagePercentage}
            subscriptionType={safeSubscription?.monthly_credits 
              ? `+${safeSubscription.monthly_credits}/mês` 
              : null}
          />

          {/* Ações de Compra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="transition-all hover:shadow-lg cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Comprar Créditos Avulsos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Adquira créditos extras que serão somados ao seu saldo atual.
                </p>
                <ul className="text-xs text-gray-500 mb-4 space-y-1">
                  <li>• Valores de 10 a 500 créditos</li>
                  <li>• Descontos em quantidades maiores</li>
                  <li>• Não expira no final do mês</li>
                </ul>
                <Button 
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full"
                  variant="outline"
                >
                  Ver Opções
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  Assinatura Recorrente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Receba créditos extras automaticamente todo mês.
                </p>
                <ul className="text-xs text-gray-500 mb-4 space-y-1">
                  <li>• Planos de +50, +100 ou +200 créditos/mês</li>
                  <li>• Renovação automática</li>
                  <li>• Cancele quando quiser</li>
                </ul>
                <Button 
                  onClick={() => setShowSubscriptionModal(true)}
                  className="w-full"
                  variant={safeSubscription?.status === 'active' ? 'outline' : 'default'}
                >
                  {safeSubscription?.status === 'active' 
                    ? 'Gerenciar Assinatura' 
                    : 'Ver Planos'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Coluna Lateral - Histórico */}
        <div className="xl:col-span-1">
          <CreditHistory transactions={safeTransactions} />
        </div>
      </div>

      {/* Informações Adicionais */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Como funcionam os créditos?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Limite mensal:</strong> Você possui {safeCredits.limit} créditos base por mês</li>
            <li>• <strong>Compras avulsas:</strong> Somam ao seu saldo atual e não expiram</li>
            <li>• <strong>Assinatura:</strong> Adiciona créditos extras automaticamente todo mês</li>
            <li>• <strong>Renovação:</strong> No dia {new Date(safeCredits.renewalDate).getDate()} de cada mês seus créditos base são renovados</li>
          </ul>
        </CardContent>
      </Card>

      {/* Modais */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchase={purchaseCredits}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={subscribeCredits}
        currentSubscription={safeSubscription}
      />
    </div>
  );
};

export default StudentCredits;
