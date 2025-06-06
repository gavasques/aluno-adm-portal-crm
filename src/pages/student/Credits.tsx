
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CreditStatusCard } from '@/components/credits/CreditStatusCard';
import { CreditActionsGrid } from '@/components/credits/CreditActionsGrid';
import { CreditInfoCard } from '@/components/credits/CreditInfoCard';
import { PurchaseModal } from '@/components/credits/PurchaseModal';
import { SubscriptionModal } from '@/components/credits/SubscriptionModal';
import { CreditHistory } from '@/components/credits/CreditHistory';
import { useCreditStatus } from '@/hooks/credits/useCreditStatus';
import { useSubscriptions } from '@/hooks/credits/useSubscriptions';
import { toast } from 'sonner';

const StudentCredits = () => {
  const { 
    creditStatus, 
    isLoading, 
    error, 
    refreshCredits
  } = useCreditStatus();

  const { createSubscription } = useSubscriptions();

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

  const handlePurchaseSuccess = () => {
    console.log('📈 Compra realizada com sucesso, atualizando créditos...');
    refreshCredits();
  };

  const handleSubscriptionSuccess = () => {
    console.log('📱 Assinatura realizada com sucesso, atualizando créditos...');
    refreshCredits();
  };

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="xl:col-span-2 space-y-6">
          {/* Status de Créditos */}
          <CreditStatusCard
            creditStatus={creditStatus}
            isLoading={isLoading}
            error={error}
            onRefresh={handleRefresh}
          />

          {/* Ações de Compra */}
          <CreditActionsGrid
            subscription={safeSubscription}
            onOpenPurchaseModal={() => setShowPurchaseModal(true)}
            onOpenSubscriptionModal={() => setShowSubscriptionModal(true)}
          />
        </div>

        {/* Coluna Lateral - Histórico */}
        <div className="xl:col-span-1">
          <CreditHistory transactions={safeTransactions} />
        </div>
      </div>

      {/* Informações Adicionais */}
      <CreditInfoCard 
        creditLimit={safeCredits.limit}
        renewalDate={safeCredits.renewalDate}
      />

      {/* Modais */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onSuccess={handlePurchaseSuccess}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handleSubscriptionSuccess}
        currentSubscription={safeSubscription}
      />
    </div>
  );
};

export default StudentCredits;
