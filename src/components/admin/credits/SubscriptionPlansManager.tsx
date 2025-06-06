
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { useCreditSettings, CreditSubscriptionPlan } from '@/hooks/credits/useCreditSettings';

export const SubscriptionPlansManager: React.FC = () => {
  const { creditSettings, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } = useCreditSettings();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CreditSubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    monthly_credits: 0,
    price: 0,
    description: '',
    is_popular: false,
    is_active: true,
    sort_order: 0,
    stripe_price_id: ''
  });

  const plans = creditSettings?.subscriptionPlans || [];

  const resetForm = () => {
    setFormData({
      name: '',
      monthly_credits: 0,
      price: 0,
      description: '',
      is_popular: false,
      is_active: true,
      sort_order: 0,
      stripe_price_id: ''
    });
  };

  const handleCreate = async () => {
    try {
      await createSubscriptionPlan.mutateAsync({
        ...formData,
        stripe_price_id: formData.stripe_price_id || null
      });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar plano:', error);
    }
  };

  const handleEdit = (plan: CreditSubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      monthly_credits: plan.monthly_credits,
      price: plan.price,
      description: plan.description || '',
      is_popular: plan.is_popular,
      is_active: plan.is_active,
      sort_order: plan.sort_order,
      stripe_price_id: plan.stripe_price_id || ''
    });
  };

  const handleUpdate = async () => {
    if (!editingPlan) return;

    try {
      await updateSubscriptionPlan.mutateAsync({
        id: editingPlan.id,
        ...formData,
        stripe_price_id: formData.stripe_price_id || null
      });
      setEditingPlan(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Tem certeza que deseja desativar este plano?')) return;

    try {
      await deleteSubscriptionPlan.mutateAsync(planId);
    } catch (error) {
      console.error('Erro ao desativar plano:', error);
    }
  };

  const validateStripePriceId = (value: string): boolean => {
    if (!value) return true; // Opcional
    return value.startsWith('price_') && value.length > 6;
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.monthly_credits > 0 &&
      formData.price > 0 &&
      validateStripePriceId(formData.stripe_price_id)
    );
  };

  const PlanModal = ({ isOpen, onClose, onSave, title }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    title: string;
  }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Plano</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Plano Básico"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly_credits">Créditos/Mês</Label>
              <Input
                id="monthly_credits"
                type="number"
                value={formData.monthly_credits}
                onChange={(e) => setFormData(prev => ({ ...prev, monthly_credits: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="price">Preço Mensal (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do plano..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="stripe_price_id">Stripe Price ID (Obrigatório para assinaturas)</Label>
            <Input
              id="stripe_price_id"
              type="text"
              placeholder="price_1234567890abcdef"
              value={formData.stripe_price_id}
              onChange={(e) => setFormData(prev => ({ ...prev, stripe_price_id: e.target.value }))}
              className={!validateStripePriceId(formData.stripe_price_id) ? 'border-red-500' : ''}
            />
            <div className="flex items-center gap-2 mt-2">
              {formData.stripe_price_id && validateStripePriceId(formData.stripe_price_id) ? (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <Check className="h-3 w-3" />
                  Price ID válido
                </div>
              ) : formData.stripe_price_id ? (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  Deve começar com "price_"
                </div>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}
                className="ml-auto"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Stripe Dashboard
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Obrigatório: Configure um produto recorrente no Stripe
            </p>
          </div>

          <div>
            <Label htmlFor="sort_order">Ordem de Exibição</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_popular"
                checked={formData.is_popular}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked }))}
              />
              <Label htmlFor="is_popular">Mais Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Ativo</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={onSave} 
              disabled={!isFormValid()}
              className="flex-1"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Planos de Assinatura</CardTitle>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {plans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum plano de assinatura configurado
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{plan.name}</h3>
                      {plan.is_popular && <Badge variant="secondary">Popular</Badge>}
                      {!plan.is_active && <Badge variant="destructive">Inativo</Badge>}
                      {plan.stripe_price_id && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Stripe ID
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-green-600">R$ {plan.price.toFixed(2)}/mês</span>
                      {' '}• {plan.monthly_credits} créditos/mês
                    </div>
                    {plan.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {plan.description}
                      </div>
                    )}
                    {plan.stripe_price_id && (
                      <div className="text-xs text-gray-500 font-mono">
                        {plan.stripe_price_id}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <PlanModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            resetForm();
          }}
          onSave={handleCreate}
          title="Criar Novo Plano"
        />

        <PlanModal
          isOpen={!!editingPlan}
          onClose={() => {
            setEditingPlan(null);
            resetForm();
          }}
          onSave={handleUpdate}
          title="Editar Plano"
        />
      </CardContent>
    </Card>
  );
};
