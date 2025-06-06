
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Save, X, Package } from 'lucide-react';
import { useCreditSettings, CreditPackage } from '@/hooks/credits/useCreditSettings';
import { Label } from '@/components/ui/label';

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
      original_price: editingPackage.original_price || editingPackage.price || 0,
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
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-blue-600" />
            Pacotes de Créditos Avulsos
          </CardTitle>
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
                  <div>
                    <Label htmlFor="pkg-credits" className="text-sm">Créditos</Label>
                    <Input
                      id="pkg-credits"
                      type="number"
                      value={editingPackage.credits}
                      onChange={(e) => setEditingPackage({ ...editingPackage, credits: parseInt(e.target.value) })}
                      placeholder="Créditos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pkg-price" className="text-sm">Preço (R$)</Label>
                    <Input
                      id="pkg-price"
                      type="number"
                      step="0.01"
                      value={editingPackage.price}
                      onChange={(e) => setEditingPackage({ ...editingPackage, price: parseFloat(e.target.value) })}
                      placeholder="Preço"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pkg-original" className="text-sm">Preço Original</Label>
                    <Input
                      id="pkg-original"
                      type="number"
                      step="0.01"
                      value={editingPackage.original_price}
                      onChange={(e) => setEditingPackage({ ...editingPackage, original_price: parseFloat(e.target.value) })}
                      placeholder="Preço original"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pkg-discount" className="text-sm">Desconto (%)</Label>
                    <Input
                      id="pkg-discount"
                      type="number"
                      value={editingPackage.discount_percentage}
                      onChange={(e) => setEditingPackage({ ...editingPackage, discount_percentage: parseInt(e.target.value) })}
                      placeholder="% desconto"
                    />
                  </div>
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
                      {pkg.original_price > pkg.price && (
                        <p className="text-xs text-gray-500 line-through">R$ {pkg.original_price.toFixed(2)}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        R$ {(pkg.price / pkg.credits).toFixed(2)} por crédito
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {pkg.is_popular && <Badge variant="default">Popular</Badge>}
                      {!pkg.is_active && <Badge variant="secondary">Inativo</Badge>}
                      {pkg.discount_percentage > 0 && (
                        <Badge variant="destructive">{pkg.discount_percentage}% OFF</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Ordem: {pkg.sort_order}
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
            <div className="flex-1 grid grid-cols-6 gap-4 items-end p-4 border rounded-lg bg-blue-50">
              <div>
                <Label htmlFor="new-pkg-credits" className="text-sm">Créditos</Label>
                <Input
                  id="new-pkg-credits"
                  type="number"
                  value={editingPackage.credits}
                  onChange={(e) => setEditingPackage({ ...editingPackage, credits: parseInt(e.target.value) })}
                  placeholder="Créditos"
                />
              </div>
              <div>
                <Label htmlFor="new-pkg-price" className="text-sm">Preço (R$)</Label>
                <Input
                  id="new-pkg-price"
                  type="number"
                  step="0.01"
                  value={editingPackage.price}
                  onChange={(e) => setEditingPackage({ ...editingPackage, price: parseFloat(e.target.value) })}
                  placeholder="Preço"
                />
              </div>
              <div>
                <Label htmlFor="new-pkg-original" className="text-sm">Preço Original</Label>
                <Input
                  id="new-pkg-original"
                  type="number"
                  step="0.01"
                  value={editingPackage.original_price}
                  onChange={(e) => setEditingPackage({ ...editingPackage, original_price: parseFloat(e.target.value) })}
                  placeholder="Preço original"
                />
              </div>
              <div>
                <Label htmlFor="new-pkg-discount" className="text-sm">Desconto (%)</Label>
                <Input
                  id="new-pkg-discount"
                  type="number"
                  value={editingPackage.discount_percentage}
                  onChange={(e) => setEditingPackage({ ...editingPackage, discount_percentage: parseInt(e.target.value) })}
                  placeholder="% desconto"
                />
              </div>
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
