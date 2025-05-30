
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
  Clock,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Interface otimizada para os dados retornados
interface UserCreditsData {
  id: string;
  email: string;
  name?: string | null;
  current_credits?: number;
  monthly_limit?: number;
  used_this_month?: number;
  renewal_date?: string;
  subscription_status?: string;
  subscription_monthly_credits?: number;
}

const UserCreditsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserCreditsData | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const queryClient = useQueryClient();

  // Query otimizada com JOIN melhorado
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users-credits', searchTerm],
    queryFn: async () => {
      console.log('🔍 Buscando usuários com créditos, termo de busca:', searchTerm);
      
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          name,
          user_credits (
            current_credits,
            monthly_limit,
            used_this_month,
            renewal_date
          )
        `);

      if (searchTerm.trim()) {
        query = query.or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      const { data: profiles, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro na query de perfis:', error);
        throw error;
      }

      // Buscar assinaturas separadamente para evitar JOIN complexo
      const userIds = profiles?.map(p => p.id) || [];
      let subscriptions: any[] = [];
      
      if (userIds.length > 0) {
        const { data: subsData } = await supabase
          .from('credit_subscriptions')
          .select('user_id, status, monthly_credits')
          .in('user_id', userIds)
          .eq('status', 'active');
        
        subscriptions = subsData || [];
      }

      // Combinar dados
      const result = profiles?.map(profile => {
        const credits = Array.isArray(profile.user_credits) && profile.user_credits.length > 0
          ? profile.user_credits[0] 
          : null;
        
        const subscription = subscriptions.find(s => s.user_id === profile.id);
        
        return {
          ...profile,
          current_credits: credits?.current_credits || 0,
          monthly_limit: credits?.monthly_limit || 50,
          used_this_month: credits?.used_this_month || 0,
          renewal_date: credits?.renewal_date,
          subscription_status: subscription?.status,
          subscription_monthly_credits: subscription?.monthly_credits
        };
      }) || [];

      console.log('✅ Dados de usuários carregados:', result.length, 'usuários');
      return result;
    },
    staleTime: 60000, // Cache por 1 minuto
    retry: 2
  });

  // Mutação otimizada usando a nova função do banco
  const adjustCreditsMutation = useMutation({
    mutationFn: async ({ userId, amount, type, reason }: {
      userId: string;
      amount: string; 
      type: string; 
      reason: string;
    }) => {
      console.log('🔧 Ajustando créditos via função do banco:', { userId, amount, type, reason });

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

      if (!data.success) {
        throw new Error(data.error || 'Erro desconhecido no ajuste');
      }

      return data;
    },
    onSuccess: (data, variables) => {
      console.log('✅ Créditos ajustados com sucesso:', data);
      toast.success(`Créditos ajustados! ${data.previous_credits} → ${data.new_credits}`);
      queryClient.invalidateQueries({ queryKey: ['admin-users-credits'] });
      setSelectedUser(null);
      setAdjustmentAmount("");
      setAdjustmentReason("");
    },
    onError: (error: any) => {
      console.error('❌ Erro ao ajustar créditos:', error);
      toast.error('Erro ao ajustar créditos: ' + error.message);
    }
  });

  const getStatusBadge = (user: UserCreditsData) => {
    const percentage = (user.current_credits / user.monthly_limit) * 100;
    
    if (user.current_credits === 0) {
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
      <div className="max-w-full overflow-x-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando gestão de créditos...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gestão de Créditos por Usuário</span>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
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
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Usuário</TableHead>
                  <TableHead className="min-w-[120px]">Créditos Atuais</TableHead>
                  <TableHead className="min-w-[120px]">Limite Mensal</TableHead>
                  <TableHead className="min-w-[120px]">Consumidos</TableHead>
                  <TableHead className="min-w-[150px]">Status</TableHead>
                  <TableHead className="min-w-[150px]">Assinatura</TableHead>
                  <TableHead className="min-w-[120px]">Renovação</TableHead>
                  <TableHead className="min-w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name || user.email}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {user.current_credits}
                    </TableCell>
                    <TableCell className="font-mono">
                      {user.monthly_limit}
                    </TableCell>
                    <TableCell className="font-mono">
                      {user.used_this_month}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell>
                      {user.subscription_status === 'active' ? (
                        <Badge variant="default" className="bg-blue-600">
                          +{user.subscription_monthly_credits}/mês
                        </Badge>
                      ) : (
                        <Badge variant="outline">Sem assinatura</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.renewal_date ? 
                        new Date(user.renewal_date).toLocaleDateString('pt-BR') : 
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
                                    {user.current_credits}
                                  </div>
                                </div>
                                <div>
                                  <Label>Limite Mensal</Label>
                                  <div className="text-2xl font-bold">
                                    {user.monthly_limit}
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
                                  min="1"
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
                                      userId: user.id,
                                      amount: adjustmentAmount,
                                      type: adjustmentType,
                                      reason: adjustmentReason.trim()
                                    });
                                  }}
                                  disabled={adjustCreditsMutation.isPending}
                                  className="flex-1"
                                >
                                  {adjustCreditsMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                  {adjustmentType === 'add' && <Plus className="w-4 h-4 mr-2" />}
                                  {adjustmentType === 'subtract' && <Minus className="w-4 h-4 mr-2" />}
                                  {adjustmentType === 'set' && <Settings className="w-4 h-4 mr-2" />}
                                  {adjustCreditsMutation.isPending ? 'Processando...' : 'Aplicar Ajuste'}
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
                ))}
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
    return (
      <div className="flex items-center gap-2 py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Carregando histórico...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default UserCreditsManagement;
