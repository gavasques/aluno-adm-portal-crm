
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { useCreditSettings, CreditPackage } from '@/hooks/credits/useCreditSettings';

interface EditingPackage extends Partial<CreditPackage> {
  isNew?: boolean;
}

export const CreditPackagesManager: React.FC = () => {
  const { creditSettings, updateCreditPackage, createCreditPackage, deleteCreditPackage } = useCreditSettings();
  const [editingPackage, setEditingPackage] = useState<EditingPackage | null>(null);

  const packages = creditSettings?.packages || [];

  const handleEdit = (pkg: CreditPackage) => {
    setEditingPackage({ ...pkg });
  };

  const handleNew = () => {
    setEditingPackage({
      credits: 0,
      price: 0,
      original_price: 0,
      discount_percentage: 0,
      is_popular: false,
      is_active: true,
      sort_order: packages.length + 1,
      isNew: true
    });
  };

  const handleSave = () => {
    if (!editingPackage) return;

    const packageData = {
      credits: editingPackage.credits || 0,
      price: editingPackage.price || 0,
      original_price: editingPackage.original_price || 0,
      discount_percentage: editingPackage.discount_percentage || 0,
      is_popular: editingPackage.is_popular || false,
      is_active: editingPackage.is_active !== false,
      sort_order: editingPackage.sort_order || 0
    };

    if (editingPackage.isNew) {
      createCreditPackage.mutate(packageData);
    } else if (editingPackage.id) {
      updateCreditPackage.mutate({ ...packageData, id: editingPackage.id });
    }

    setEditingPackage(null);
  };

  const handleCancel = () => {
    setEditingPackage(null);
  };

  const handleDelete = (packageId: string) => {
    if (confirm('Tem certeza que deseja desativar este pacote?')) {
      deleteCreditPackage.mutate(packageId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Pacotes de Créditos</CardTitle>
          <Button onClick={handleNew} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pacote
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
              {editingPackage?.id === pkg.id ? (
                <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                  <Input
                    type="number"
                    value={editingPackage.credits}
                    onChange={(e) => setEditingPackage({ ...editingPackage, credits: parseInt(e.target.value) })}
                    placeholder="Créditos"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({ ...editingPackage, price: parseFloat(e.target.value) })}
                    placeholder="Preço"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={editingPackage.original_price}
                    onChange={(e) => setEditingPackage({ ...editingPackage, original_price: parseFloat(e.target.value) })}
                    placeholder="Preço Original"
                  />
                  <Input
                    type="number"
                    value={editingPackage.discount_percentage}
                    onChange={(e) => setEditingPackage({ ...editingPackage, discount_percentage: parseInt(e.target.value) })}
                    placeholder="Desconto %"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingPackage.is_popular}
                      onCheckedChange={(checked) => setEditingPackage({ ...editingPackage, is_popular: checked })}
                    />
                    <span className="text-sm">Popular</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" variant="default">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                    <div>
                      <span className="font-semibold">{pkg.credits} créditos</span>
                    </div>
                    <div>
                      <span className="text-green-600 font-semibold">R$ {pkg.price.toFixed(2)}</span>
                      {pkg.discount_percentage > 0 && (
                        <span className="text-gray-500 line-through ml-2">R$ {pkg.original_price.toFixed(2)}</span>
                      )}
                    </div>
                    <div>
                      {pkg.discount_percentage > 0 && (
                        <Badge variant="destructive">{pkg.discount_percentage}% OFF</Badge>
                      )}
                    </div>
                    <div>
                      {pkg.is_popular && <Badge variant="default">Popular</Badge>}
                      {!pkg.is_active && <Badge variant="secondary">Inativo</Badge>}
                    </div>
                    <div className="text-sm text-gray-600">
                      R$ {(pkg.price / pkg.credits).toFixed(2)} por crédito
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(pkg)} size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(pkg.id)} size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {editingPackage?.isNew && (
            <div className="flex-1 grid grid-cols-6 gap-4 items-center p-4 border rounded-lg bg-blue-50">
              <Input
                type="number"
                value={editingPackage.credits}
                onChange={(e) => setEditingPackage({ ...editingPackage, credits: parseInt(e.target.value) })}
                placeholder="Créditos"
              />
              <Input
                type="number"
                step="0.01"
                value={editingPackage.price}
                onChange={(e) => setEditingPackage({ ...editingPackage, price: parseFloat(e.target.value) })}
                placeholder="Preço"
              />
              <Input
                type="number"
                step="0.01"
                value={editingPackage.original_price}
                onChange={(e) => setEditingPackage({ ...editingPackage, original_price: parseFloat(e.target.value) })}
                placeholder="Preço Original"
              />
              <Input
                type="number"
                value={editingPackage.discount_percentage}
                onChange={(e) => setEditingPackage({ ...editingPackage, discount_percentage: parseInt(e.target.value) })}
                placeholder="Desconto %"
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingPackage.is_popular}
                  onCheckedChange={(checked) => setEditingPackage({ ...editingPackage, is_popular: checked })}
                />
                <span className="text-sm">Popular</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" variant="default">
                  <Save className="h-4 w-4" />
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
