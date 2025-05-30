
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Users, TrendingUp, DollarSign } from 'lucide-react';

const AdminCredits = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Créditos</h1>
        <p className="text-muted-foreground">
          Gerencie créditos dos usuários e pacotes disponíveis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Total Créditos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,420</div>
            <p className="text-xs text-muted-foreground">
              Em circulação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              Com créditos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Consumo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Créditos/usuário/mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Receita Créditos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.5k</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidade em Desenvolvimento</CardTitle>
          <CardDescription>
            Sistema completo de gestão de créditos será implementado em breve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta página está sendo desenvolvida. Em breve você poderá:
          </p>
          <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Gerenciar pacotes de créditos</li>
            <li>Visualizar histórico de consumo</li>
            <li>Configurar preços e promoções</li>
            <li>Relatórios detalhados de uso</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCredits;
