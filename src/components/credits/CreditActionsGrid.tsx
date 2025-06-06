
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Crown } from 'lucide-react';

interface CreditActionsGridProps {
  subscription: any;
  onOpenPurchaseModal: () => void;
  onOpenSubscriptionModal: () => void;
}

export const CreditActionsGrid: React.FC<CreditActionsGridProps> = ({
  subscription,
  onOpenPurchaseModal,
  onOpenSubscriptionModal
}) => {
  return (
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
            onClick={onOpenPurchaseModal}
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
            onClick={onOpenSubscriptionModal}
            className="w-full"
            variant={subscription?.status === 'active' ? 'outline' : 'default'}
          >
            {subscription?.status === 'active' 
              ? 'Gerenciar Assinatura' 
              : 'Ver Planos'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
