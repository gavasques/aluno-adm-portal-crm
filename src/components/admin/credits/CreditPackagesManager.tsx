
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { useCreditSettings, CreditPackage } from '@/hooks/credits/useCreditSettings';
import { toast } from 'sonner';

export const CreditPackagesManager: React.FC = () => {
  const { creditSettings, createCreditPackage, updateCreditPackage, deleteCreditPackage } = useCreditSettings();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);
  const [formData, setFormData] = useState({
    credits: 0,
    price: 0,
    original_price: 0,
    discount_percentage: 0,
    is_popular: false,
    is_active: true,
    sort_order: 0,
    stripe_price_id: ''
  });

  const packages = creditSettings?.packages || [];

  const resetForm = () => {
    setFormData({
      credits: 0,
      price: 0,
      original_price: 0,
      discount_percentage: 0,
      is_popular: false,
      is_active: true,
      sort_order: 0,
      stripe_price_id: ''
    });
  };

  const handleCreate = async () => {
    try {
      await createCreditPackage.mutateAsync(formData);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar pacote:', error);
    }
  };

  const handleEdit = (pkg: CreditPackage) => {
    setEditingPackage(pkg);
    setFormData({
      credits: pkg.credits,
      price: pkg.price,
      original_price: pkg.original_price,
      discount_percentage: pkg.discount_percentage,
      is_popular: pkg.is_popular,
      is_active: pkg.is_active,
      sort_order: pkg.sort_order,
      stripe_price_id: pkg.stripe_price_id || ''
    });
  };

  const handleUpdate = async () => {
    if (!editingPackage) return;

    try {
      await updateCreditPackage.mutateAsync({
        id: editingPackage.id,
        ...formData,
        stripe_price_id: formData.stripe_price_id || null
      });
      setEditingPackage(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar pacote:', error);
    }
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm('Tem certeza que deseja desativar este pacote?')) return;

    try {
      await deleteCreditPackage.mutateAsync(packageId);
    } catch (error) {
      console.error('Erro ao desativar pacote:', error);
    }
  };

  const validateStripePriceId = (value: string): boolean => {
    if (!value) return true; // Opcional
    return value.startsWith('price_') && value.length > 6;
  };

  const isFormValid = () => {
    return (
      formData.credits > 0 &&
      formData.price > 0 &&
      formData.original_price >= formData.price &&
      validateStripePriceId(formData.stripe_price_id)
    );
  };

  const PackageModal = ({ isOpen, onClose, onSave, title }: {
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="credits">Créditos</Label>
              <Input
                id="credits"
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="original_price">Preço Original (R$)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="discount">Desconto (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stripe_price_id">Stripe Price ID (Opcional)</Label>
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
              Configure um produto no Stripe e cole o Price ID aqui para usar preços pré-configurados
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sort_order">Ordem</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
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
          <CardTitle>Pacotes de Créditos Avulsos</CardTitle>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Pacote
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {packages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum pacote de créditos configurado
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{pkg.credits} Créditos</h3>
                      {pkg.is_popular && <Badge variant="secondary">Popular</Badge>}
                      {!pkg.is_active && <Badge variant="destructive">Inativo</Badge>}
                      {pkg.stripe_price_id && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Stripe ID
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-green-600">R$ {pkg.price.toFixed(2)}</span>
                      {pkg.discount_percentage > 0 && (
                        <>
                          {' '}• <span className="line-through">R$ {pkg.original_price.toFixed(2)}</span>
                          {' '}• <span className="text-red-600">{pkg.discount_percentage}% OFF</span>
                        </>
                      )}
                    </div>
                    {pkg.stripe_price_id && (
                      <div className="text-xs text-gray-500 font-mono">
                        {pkg.stripe_price_id}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(pkg)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(pkg.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <PackageModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            resetForm();
          }}
          onSave={handleCreate}
          title="Criar Novo Pacote"
        />

        <PackageModal
          isOpen={!!editingPackage}
          onClose={() => {
            setEditingPackage(null);
            resetForm();
          }}
          onSave={handleUpdate}
          title="Editar Pacote"
        />
      </CardContent>
    </Card>
  );
};
