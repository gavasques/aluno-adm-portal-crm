
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
  Calendar
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

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

  // Buscar dados de créditos do usuário
  const { data: userCredits, isLoading: creditsLoading } = useQuery({
    queryKey: ['user-credits-detail', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_credits')
        .select(`
          *,
          credit_subscriptions!inner(
            status,
            monthly_credits,
            next_billing_date
          )
        `)
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  // Buscar histórico de transações
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['user-credit-transactions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Mutação para ajustar créditos
  const adjustCreditsMutation = useMutation({
    mutationFn: async ({ amount, type, reason }: { 
      amount: string; 
      type: string; 
      reason: string; 
    }) => {
      if (!userCredits) throw new Error('Dados de créditos não encontrados');

      let newAmount;
      if (type === 'add') {
        newAmount = userCredits.current_credits + parseInt(amount);
      } else if (type === 'subtract') {
        newAmount = Math.max(0, userCredits.current_credits - parseInt(amount));
      } else {
        newAmount = parseInt(amount);
      }

      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ current_credits: newAmount })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Registrar no histórico
      const { error: historyError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          type: type === 'add' ? 'compra' : type === 'subtract' ? 'uso' : 'renovacao',
          amount: type === 'subtract' ? -parseInt(amount) : parseInt(amount),
          description: `Ajuste manual pelo admin: ${reason}`
        });

      if (historyError) throw historyError;
    },
    onSuccess: () => {
      toast.success('Créditos ajustados com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['user-credits-detail', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-credit-transactions', userId] });
      setAdjustmentAmount("");
      setAdjustmentReason("");
    },
    onError: (error: any) => {
      toast.error('Erro ao ajustar créditos: ' + error.message);
    }
  });

  const getStatusBadge = () => {
    if (!userCredits) return <Badge variant="secondary">Sem dados</Badge>;

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
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
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
              if (!adjustmentAmount || !adjustmentReason) {
                toast.error('Preencha quantidade e motivo');
                return;
              }
              adjustCreditsMutation.mutate({
                amount: adjustmentAmount,
                type: adjustmentType,
                reason: adjustmentReason
              });
            }}
            disabled={adjustCreditsMutation.isPending}
            className="w-full"
          >
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
            <div className="animate-pulse space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
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
