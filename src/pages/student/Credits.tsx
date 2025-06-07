
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, History, Zap } from 'lucide-react';

const Credits = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Créditos</h1>
          <p className="text-gray-600">Gerencie seus créditos e histórico de uso</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Comprar Créditos
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">créditos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usados Este Mês</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320</div>
            <p className="text-xs text-muted-foreground">de 1,000 créditos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Badge variant="default">Ativo</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Premium</div>
            <p className="text-xs text-muted-foreground">renovação em 15 dias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Transações
          </CardTitle>
          <CardDescription>Últimas movimentações dos seus créditos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Uso do Livi AI</p>
                <p className="text-sm text-gray-600">Hoje, 14:30</p>
              </div>
              <Badge variant="destructive">-15 créditos</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Compra de Créditos</p>
                <p className="text-sm text-gray-600">Ontem, 09:15</p>
              </div>
              <Badge variant="default">+500 créditos</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Uso do Livi AI</p>
                <p className="text-sm text-gray-600">2 dias atrás, 16:45</p>
              </div>
              <Badge variant="destructive">-25 créditos</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Credits;
