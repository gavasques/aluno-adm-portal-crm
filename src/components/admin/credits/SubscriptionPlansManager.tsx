
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, X, Crown, Edit, Trash2 } from 'lucide-react';
import { useCreditSettings, CreditSubscriptionPlan } from '@/hooks/credits/useCreditSettings';
import { toast } from 'sonner';

const defaultPlan: Omit<CreditSubscriptionPlan, 'id'> = {
  name: '',
  monthly_credits: 50,
  price: 50,
  is_popular: false,
  is_active: true,
  sort_order: 0,
  stripe_price_id: null,
  description: null
};

export const SubscriptionPlansManager: React.FC = () => {
  const { creditSettings, updateSubscriptionPlan, createSubscriptionPlan, deleteSubscriptionPlan } = useCreditSettings();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CreditSubscriptionPlan | null>(null);
  const [newPlan, setNewPlan] = useState<Omit<CreditSubscriptionPlan, 'id'>>(defaultPlan);

  const subscriptionPlans = creditSettings?.subscriptionPlans || [];

  const handleCreatePlan = async () => {
    if (!newPlan.name.trim()) {
      toast.error('Nome do plano é obrigatório');
      return;
    }

    if (newPlan.monthly_credits <= 0) {
      toast.error('Créditos mensais deve ser maior que zero');
      return;
    }

    if (newPlan.price <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    try {
      await createSubscriptionPlan.mutateAsync(newPlan);
      setIsCreating(false);
      setNewPlan(defaultPlan);
    } catch (error) {
      console.error('Erro ao criar plano:', error);
    }
  };

  const handleUpdatePlan = async (plan: CreditSubscriptionPlan) => {
    if (!plan.name.trim()) {
      toast.error('Nome do plano é obrigatório');
      return;
    }

    try {
      await updateSubscriptionPlan.mutateAsync(plan);
      setEditingPlan(null);
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Tem certeza que deseja desativar este plano?')) {
      try {
        await deleteSubscriptionPlan.mutateAsync(planId);
      } catch (error) {
        console.error('Erro ao desativar plano:', error);
      }
    }
  };

  const startEditing = (plan: CreditSubscriptionPlan) => {
    setEditingPlan({ ...plan });
  };

  const cancelEditing = () => {
    setEditingPlan(null);
  };

  if (!creditSettings) {
    return <div>Carregando planos de assinatura...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de criar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Planos de Assinatura Recorrentes
          </h3>
          <p className="text-sm text-gray-600">
            Gerencie os planos de assinatura mensais de créditos
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Formulário de criação */}
      {isCreating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Criar Novo Plano de Assinatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-name">Nome do Plano</Label>
                <Input
                  id="new-name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="Ex: Básico, Profissional"
                />
              </div>
              <div>
                <Label htmlFor="new-credits">Créditos Mensais</Label>
                <Input
                  id="new-credits"
                  type="number"
                  value={newPlan.monthly_credits}
                  onChange={(e) => setNewPlan({ ...newPlan, monthly_credits: parseInt(e.target.value) })}
                  placeholder="Ex: 50, 100, 200"
                />
              </div>
              <div>
                <Label htmlFor="new-price">Preço Mensal (R$)</Label>
                <Input
                  id="new-price"
                  type="number"
                  step="0.01"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                  placeholder="Ex: 50.00"
                />
              </div>
              <div>
                <Label htmlFor="new-stripe-id">Stripe Price ID</Label>
                <Input
                  id="new-stripe-id"
                  value={newPlan.stripe_price_id || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, stripe_price_id: e.target.value || null })}
                  placeholder="price_xxx (opcional)"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="new-description">Descrição</Label>
              <Textarea
                id="new-description"
                value={newPlan.description || ''}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value || null })}
                placeholder="Descrição opcional do plano"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newPlan.is_popular}
                  onCheckedChange={(checked) => setNewPlan({ ...newPlan, is_popular: checked })}
                />
                <Label>Plano Popular</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newPlan.is_active}
                  onCheckedChange={(checked) => setNewPlan({ ...newPlan, is_active: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreatePlan} disabled={createSubscriptionPlan.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Criar Plano
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de planos */}
      <div className="space-y-4">
        {subscriptionPlans.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Crown className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum plano de assinatura criado</h3>
              <p className="text-gray-500 mb-4">Crie seu primeiro plano de assinatura recorrente</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Plano
              </Button>
            </CardContent>
          </Card>
        ) : (
          subscriptionPlans.map((plan) => (
            <Card key={plan.id} className={editingPlan?.id === plan.id ? 'border-blue-500' : ''}>
              <CardContent className="p-6">
                {editingPlan?.id === plan.id ? (
                  // Modo de edição
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Plano</Label>
                        <Input
                          value={editingPlan.name}
                          onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Créditos Mensais</Label>
                        <Input
                          type="number"
                          value={editingPlan.monthly_credits}
                          onChange={(e) => setEditingPlan({ ...editingPlan, monthly_credits: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Preço Mensal (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editingPlan.price}
                          onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Stripe Price ID</Label>
                        <Input
                          value={editingPlan.stripe_price_id || ''}
                          onChange={(e) => setEditingPlan({ ...editingPlan, stripe_price_id: e.target.value || null })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={editingPlan.description || ''}
                        onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value || null })}
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingPlan.is_popular}
                          onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_popular: checked })}
                        />
                        <Label>Popular</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingPlan.is_active}
                          onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_active: checked })}
                        />
                        <Label>Ativo</Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdatePlan(editingPlan)} disabled={updateSubscriptionPlan.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={cancelEditing}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modo de visualização
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold">{plan.name}</h4>
                        <div className="flex gap-1">
                          {plan.is_popular && <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>}
                          {!plan.is_active && <Badge variant="secondary">Inativo</Badge>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Créditos/Mês:</span>
                          <p className="font-semibold">+{plan.monthly_credits}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Preço:</span>
                          <p className="font-semibold text-green-600">R$ {plan.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Por Crédito:</span>
                          <p className="font-semibold">R$ {(plan.price / plan.monthly_credits).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Stripe ID:</span>
                          <p className="font-mono text-xs">{plan.stripe_price_id || 'Não configurado'}</p>
                        </div>
                      </div>
                      {plan.description && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEditing(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Informações sobre integração */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-amber-900 mb-2">💡 Configuração do Stripe</h4>
          <div className="text-sm text-amber-800 space-y-1">
            <p>• Para funcionar em produção, configure os Stripe Price IDs para cada plano</p>
            <p>• Em modo desenvolvimento, as assinaturas funcionam como simulação</p>
            <p>• Planos marcados como "Popular" aparecem destacados na página do aluno</p>
            <p>• Planos inativos não são exibidos para os alunos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
