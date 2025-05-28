
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Minus, 
  Settings, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Corrigindo a interface para corresponder aos tipos reais do Supabase
interface UserWithCredits {
  id: string;
  email: string;
  name?: string;
  user_credits?: {
    current_credits: number;
    monthly_limit: number;
    used_this_month: number;
    renewal_date: string;
    subscription_type?: string;
  }[] | null;
  credit_subscriptions?: {
    status: string;
    monthly_credits: number;
    next_billing_date: string;
  }[] | null;
}

interface AdjustCreditsParams {
  userId: string;
  amount: string;
  type: string;
  reason: string;
}

interface AdjustLimitParams {
  userId: string;
  newLimit: string;
}

const UserCreditsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithCredits | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users-credits', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_credits (
            current_credits,
            monthly_limit,
            used_this_month,
            renewal_date,
            subscription_type
          ),
          credit_subscriptions (
            status,
            monthly_credits,
            next_billing_date
          )
        `);

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserWithCredits[];
    }
  });

  const adjustCreditsMutation = useMutation({
    mutationFn: async ({ userId, amount, type, reason }: AdjustCreditsParams) => {
      const { data: userCredits } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!userCredits) throw new Error('Usuário não encontrado');

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
      queryClient.invalidateQueries({ queryKey: ['admin-users-credits'] });
      setSelectedUser(null);
      setAdjustmentAmount("");
      setAdjustmentReason("");
    },
    onError: (error) => {
      toast.error('Erro ao ajustar créditos: ' + error.message);
    }
  });

  const adjustLimitMutation = useMutation({
    mutationFn: async ({ userId, newLimit }: AdjustLimitParams) => {
      const { error } = await supabase
        .from('user_credits')
        .update({ monthly_limit: parseInt(newLimit) })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Limite mensal atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-users-credits'] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar limite: ' + error.message);
    }
  });

  const getStatusBadge = (user: UserWithCredits) => {
    const credits = user.user_credits?.[0];
    if (!credits) return <Badge variant="secondary">Sem dados</Badge>;

    const percentage = (credits.current_credits / credits.monthly_limit) * 100;
    
    if (credits.current_credits === 0) {
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

  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando usuários...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gestão de Créditos por Usuário</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Créditos Atuais</TableHead>
                  <TableHead>Limite Mensal</TableHead>
                  <TableHead>Consumidos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assinatura</TableHead>
                  <TableHead>Renovação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const credits = user.user_credits?.[0];
                  const subscription = user.credit_subscriptions?.[0];
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name || user.email}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {credits?.current_credits || 0}
                      </TableCell>
                      <TableCell className="font-mono">
                        {credits?.monthly_limit || 50}
                      </TableCell>
                      <TableCell className="font-mono">
                        {credits?.used_this_month || 0}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user)}
                      </TableCell>
                      <TableCell>
                        {subscription?.status === 'active' ? (
                          <Badge variant="default" className="bg-blue-600">
                            +{subscription.monthly_credits}/mês
                          </Badge>
                        ) : (
                          <Badge variant="outline">Sem assinatura</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {credits?.renewal_date ? 
                          new Date(credits.renewal_date).toLocaleDateString('pt-BR') : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Ajustar Créditos - {user.name || user.email}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Créditos Atuais</Label>
                                    <div className="text-2xl font-bold text-blue-600">
                                      {credits?.current_credits || 0}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Limite Mensal</Label>
                                    <div className="text-2xl font-bold">
                                      {credits?.monthly_limit || 50}
                                    </div>
                                  </div>
                                </div>

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
                                  <Label>Motivo do Ajuste</Label>
                                  <Textarea
                                    value={adjustmentReason}
                                    onChange={(e) => setAdjustmentReason(e.target.value)}
                                    placeholder="Descreva o motivo do ajuste..."
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      if (!adjustmentAmount || !adjustmentReason) {
                                        toast.error('Preencha quantidade e motivo');
                                        return;
                                      }
                                      adjustCreditsMutation.mutate({
                                        userId: user.id,
                                        amount: adjustmentAmount,
                                        type: adjustmentType,
                                        reason: adjustmentReason
                                      });
                                    }}
                                    disabled={adjustCreditsMutation.isPending}
                                  >
                                    {adjustmentType === 'add' && <Plus className="w-4 h-4 mr-2" />}
                                    {adjustmentType === 'subtract' && <Minus className="w-4 h-4 mr-2" />}
                                    {adjustmentType === 'set' && <Settings className="w-4 h-4 mr-2" />}
                                    Aplicar Ajuste
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Histórico de Créditos - {user.name || user.email}</DialogTitle>
                              </DialogHeader>
                              <UserCreditHistory userId={user.id} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface UserCreditHistoryProps {
  userId: string;
}

const UserCreditHistory = ({ userId }: UserCreditHistoryProps) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['user-credit-history', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Carregando histórico...</div>;
  }

  return (
    <div className="space-y-4">
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
          {history?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {new Date(transaction.created_at).toLocaleString('pt-BR')}
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
          )) || (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum histórico encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserCreditsManagement;
