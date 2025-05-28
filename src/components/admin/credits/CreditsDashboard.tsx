
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CreditsDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-credits-stats'],
    queryFn: async () => {
      // Buscar estatísticas gerais de créditos
      const { data: users } = await supabase
        .from('user_credits')
        .select('*');
      
      const { data: transactions } = await supabase
        .from('credit_transactions')
        .select('*')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      const { data: subscriptions } = await supabase
        .from('credit_subscriptions')
        .select('*')
        .eq('status', 'active');

      const totalUsers = users?.length || 0;
      const totalCreditsInUse = users?.reduce((sum, user) => sum + user.current_credits, 0) || 0;
      const totalCreditsUsed = users?.reduce((sum, user) => sum + user.used_this_month, 0) || 0;
      const activeSubscriptions = subscriptions?.length || 0;
      const monthlyRevenue = transactions?.filter(t => t.type === 'compra').reduce((sum, t) => sum + (t.amount * 0.1), 0) || 0; // Assumindo R$ 0,10 por crédito

      const lowCreditUsers = users?.filter(user => 
        user.current_credits / user.monthly_limit < 0.2
      ).length || 0;

      const noCreditUsers = users?.filter(user => 
        user.current_credits === 0
      ).length || 0;

      return {
        totalUsers,
        totalCreditsInUse,
        totalCreditsUsed,
        activeSubscriptions,
        monthlyRevenue,
        lowCreditUsers,
        noCreditUsers
      };
    }
  });

  const statsCards = [
    {
      title: "Total de Usuários",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Créditos em Uso",
      value: stats?.totalCreditsInUse || 0,
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      title: "Créditos Consumidos (Mês)",
      value: stats?.totalCreditsUsed || 0,
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Assinaturas Ativas",
      value: stats?.activeSubscriptions || 0,
      icon: CheckCircle,
      color: "text-emerald-600"
    },
    {
      title: "Receita Mensal Estimada",
      value: `R$ ${(stats?.monthlyRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Usuários com Poucos Créditos",
      value: stats?.lowCreditUsers || 0,
      icon: AlertTriangle,
      color: "text-orange-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats && stats.noCreditUsers > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atenção: Usuários sem Créditos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              {stats.noCreditUsers} usuários estão sem créditos e não conseguem usar o sistema.
              Considere ofertar créditos gratuitos ou promoções.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uso de Créditos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usuários com Créditos Suficientes</span>
                <span>{((stats?.totalUsers || 0) - (stats?.lowCreditUsers || 0) - (stats?.noCreditUsers || 0))} usuários</span>
              </div>
              <Progress value={((((stats?.totalUsers || 0) - (stats?.lowCreditUsers || 0) - (stats?.noCreditUsers || 0)) / (stats?.totalUsers || 1)) * 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">Usuários com Poucos Créditos</span>
                <span>{stats?.lowCreditUsers || 0} usuários</span>
              </div>
              <Progress value={((stats?.lowCreditUsers || 0) / (stats?.totalUsers || 1)) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-red-600">Usuários sem Créditos</span>
                <span>{stats?.noCreditUsers || 0} usuários</span>
              </div>
              <Progress value={((stats?.noCreditUsers || 0) / (stats?.totalUsers || 1)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Receita Mensal Estimada:</span>
              <span className="font-semibold">R$ {(stats?.monthlyRevenue || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Assinaturas Ativas:</span>
              <span className="font-semibold">{stats?.activeSubscriptions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Créditos Distribuídos:</span>
              <span className="font-semibold">{stats?.totalCreditsInUse || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Consumo:</span>
              <span className="font-semibold">
                {stats?.totalCreditsInUse ? 
                  ((stats.totalCreditsUsed / stats.totalCreditsInUse) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditsDashboard;
