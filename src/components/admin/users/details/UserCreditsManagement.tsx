
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Minus, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Loader2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { AdminAdjustCreditsResponse } from "@/types/credits.types";

interface UserCreditsManagementProps {
  userId: string;
  userEmail: string;
  userName: string;
}

const UserCreditsManagement: React.FC<UserCreditsManagementProps> = ({
  userId,
  userEmail,
  userName
}) => {
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const queryClient = useQueryClient();

  // Buscar dados de créditos do usuário com query otimizada
  const { data: userCredits, isLoading: creditsLoading } = useQuery({
    queryKey: ['user-credits-detail', userId],
    queryFn: async () => {
      console.log('🔍 Buscando créditos para usuário:', userId);
      
      // Primeiro garantir que o usuário tem créditos
      const { error: ensureError } = await supabase.rpc('ensure_user_credits', {
        target_user_id: userId
      });
      
      if (ensureError) {
        console.error('Erro ao garantir créditos:', ensureError);
      }

      // Buscar créditos do usuário
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (creditsError) {
        console.error('Erro ao buscar créditos:', creditsError);
        throw creditsError;
      }

      // Buscar assinatura separadamente (opcional)
      const { data: subscription } = await supabase
        .from('credit_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      return {
        ...credits,
        subscription
      };
    },
    retry: 1,
    staleTime: 30000 // Cache por 30 segundos
  });

  // Buscar histórico de transações com limite
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['user-credit-transactions', userId],
    queryFn: async () => {
      console.log('🔍 Buscando transações para usuário:', userId);
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Erro ao buscar transações:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!userId,
    retry: 1
  });

  // Mutação otimizada para ajustar créditos usando função do banco
  const adjustCreditsMutation = useMutation({
    mutationFn: async ({ amount, type, reason }: { 
      amount: string; 
      type: string; 
      reason: string; 
    }) => {
      console.log('🔧 Ajustando créditos:', { userId, amount, type, reason });

      const { data, error } = await supabase.rpc('admin_adjust_user_credits', {
        target_user_id: userId,
        adjustment_amount: parseInt(amount),
        adjustment_type: type,
        reason: reason
      });

      if (error) {
        console.error('Erro na função de ajuste:', error);
        throw error;
      }

      // Cast do tipo para AdminAdjustCreditsResponse
      const result = data as AdminAdjustCreditsResponse;

      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido no ajuste');
      }

      return result;
    },
    onSuccess: (data) => {
      console.log('✅ Créditos ajustados com sucesso:', data);
      toast.success(`Créditos ajustados! ${data.previous_credits} → ${data.new_credits}`);
      queryClient.invalidateQueries({ queryKey: ['user-credits-detail', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-credit-transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-credits'] });
      setAdjustmentAmount("");
      setAdjustmentReason("");
    },
    onError: (error: any) => {
      console.error('❌ Erro ao ajustar créditos:', error);
      toast.error('Erro ao ajustar créditos: ' + error.message);
    }
  });

  const getStatusBadge = () => {
    if (!userCredits) return <Badge variant="secondary">Carregando...</Badge>;

    const percentage = (userCredits.current_credits / userCredits.monthly_limit) * 100;
    
    if (userCredits.current_credits === 0) {
      return <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="w-3 h-3" />
        Sem créditos
      </Badge>;
    } else if (percentage < 20) {
      return <Badge variant="secondary" className="gap-1 border-orange-500 text-orange-700">
        <Clock className="w-3 h-3" />
        Poucos créditos
      </Badge>;
    } else {
      return <Badge variant="default" className="gap-1 bg-green-600">
        <CheckCircle className="w-3 h-3" />
        Adequado
      </Badge>;
    }
  };

  if (creditsLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando dados de créditos...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Créditos Atuais</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userCredits?.current_credits || 0}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Limite Mensal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userCredits?.monthly_limit || 50}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <div className="mt-1">
                  {getStatusBadge()}
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de ajuste */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajustar Créditos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Ajuste</Label>
              <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Adicionar Créditos</SelectItem>
                  <SelectItem value="subtract">Remover Créditos</SelectItem>
                  <SelectItem value="set">Definir Quantidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                placeholder="Digite a quantidade"
              />
            </div>

            <div className="space-y-2">
              <Label>Motivo</Label>
              <Textarea
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="Motivo do ajuste..."
                rows={1}
              />
            </div>
          </div>

          <Button
            onClick={() => {
              if (!adjustmentAmount || !adjustmentReason.trim()) {
                toast.error('Preencha quantidade e motivo');
                return;
              }
              
              const amount = parseInt(adjustmentAmount);
              if (isNaN(amount) || amount <= 0) {
                toast.error('Quantidade deve ser um número positivo');
                return;
              }

              adjustCreditsMutation.mutate({
                amount: adjustmentAmount,
                type: adjustmentType,
                reason: adjustmentReason.trim()
              });
            }}
            disabled={adjustCreditsMutation.isPending}
            className="w-full"
          >
            {adjustCreditsMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {adjustmentType === 'add' && <Plus className="w-4 h-4 mr-2" />}
            {adjustmentType === 'subtract' && <Minus className="w-4 h-4 mr-2" />}
            {adjustmentType === 'set' && <Settings className="w-4 h-4 mr-2" />}
            {adjustCreditsMutation.isPending ? 'Processando...' : 'Aplicar Ajuste'}
          </Button>
        </CardContent>
      </Card>

      {/* Histórico de transações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="flex items-center gap-2 py-8">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando histórico...</span>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.type === 'uso' ? 'destructive' :
                          transaction.type === 'compra' ? 'default' : 'secondary'
                        }>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-mono ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </TableCell>
                      <TableCell className="text-sm">
                        {transaction.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhuma transação encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCreditsManagement;
