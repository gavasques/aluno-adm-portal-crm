
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Settings, Package, Crown, TrendingUp } from 'lucide-react';
import { SystemCreditSettings } from '@/components/admin/credits/SystemCreditSettings';
import { CreditPackagesManager } from '@/components/admin/credits/CreditPackagesManager';
import { SubscriptionPlansManager } from '@/components/admin/credits/SubscriptionPlansManager';
import { useCreditSettings } from '@/hooks/credits/useCreditSettings';

const Credits = () => {
  const { creditSettings, isLoading } = useCreditSettings();

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Carregando configurações...</div>
      </div>
    );
  }

  const totalPackages = creditSettings?.packages?.length || 0;
  const activePackages = creditSettings?.packages?.filter(p => p.is_active)?.length || 0;
  const totalSubscriptionPlans = creditSettings?.subscriptionPlans?.length || 0;
  const activeSubscriptionPlans = creditSettings?.subscriptionPlans?.filter(p => p.is_active)?.length || 0;
  const freeCredits = creditSettings?.systemSettings?.monthly_free_credits || 50;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuração de Créditos</h1>
        <p className="text-gray-600">
          Configure pacotes de créditos, assinaturas e configurações do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pacotes Ativos</p>
                <p className="text-2xl font-bold">{activePackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Planos Ativos</p>
                <p className="text-2xl font-bold">{activeSubscriptionPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Créditos Gratuitos/Mês</p>
                <p className="text-2xl font-bold">{freeCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pacotes</p>
                <p className="text-2xl font-bold">{totalPackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Settings className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Preço Base/Crédito</p>
                <p className="text-2xl font-bold">
                  R$ {creditSettings?.systemSettings?.credit_base_price?.toFixed(2) || '1,00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="packages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Pacotes de Créditos
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Planos de Assinatura
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações do Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <CreditPackagesManager />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionPlansManager />
        </TabsContent>

        <TabsContent value="settings">
          <SystemCreditSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Credits;
