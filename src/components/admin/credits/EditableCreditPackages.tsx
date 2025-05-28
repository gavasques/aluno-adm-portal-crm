
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  popular: boolean;
}

interface SubscriptionPlan {
  id: string;
  monthlyCredits: number;
  price: number;
  popular: boolean;
}

const EditableCreditPackages = () => {
  const [packages, setPackages] = useState<CreditPackage[]>([
    { id: '1', credits: 10, price: 1.00, popular: false },
    { id: '2', credits: 20, price: 1.80, popular: false },
    { id: '3', credits: 50, price: 4.00, popular: true },
    { id: '4', credits: 100, price: 7.50, popular: false },
    { id: '5', credits: 200, price: 14.00, popular: false },
    { id: '6', credits: 500, price: 30.00, popular: false }
  ]);

  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([
    { id: '1', monthlyCredits: 50, price: 4.90, popular: false },
    { id: '2', monthlyCredits: 100, price: 8.90, popular: true },
    { id: '3', monthlyCredits: 200, price: 15.90, popular: false }
  ]);

  const [editingPackage, setEditingPackage] = useState<string | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<string | null>(null);

  const handleSavePackage = (id: string, credits: number, price: number, popular: boolean) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, credits, price, popular } : pkg
    ));
    setEditingPackage(null);
    toast.success('Pacote atualizado com sucesso!');
  };

  const handleSaveSubscription = (id: string, monthlyCredits: number, price: number, popular: boolean) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, monthlyCredits, price, popular } : sub
    ));
    setEditingSubscription(null);
    toast.success('Plano atualizado com sucesso!');
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast.success('Pacote removido com sucesso!');
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    toast.success('Plano removido com sucesso!');
  };

  const handleAddPackage = () => {
    const newId = Math.max(...packages.map(p => parseInt(p.id))) + 1;
    const newPackage = {
      id: newId.toString(),
      credits: 25,
      price: 2.50,
      popular: false
    };
    setPackages([...packages, newPackage]);
    setEditingPackage(newId.toString());
  };

  const handleAddSubscription = () => {
    const newId = Math.max(...subscriptions.map(s => parseInt(s.id))) + 1;
    const newSubscription = {
      id: newId.toString(),
      monthlyCredits: 75,
      price: 6.90,
      popular: false
    };
    setSubscriptions([...subscriptions, newSubscription]);
    setEditingSubscription(newId.toString());
  };

  return (
    <div className="space-y-8">
      {/* Pacotes de Créditos Avulsos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            📦 Pacotes de Créditos Avulsos
          </CardTitle>
          <Button onClick={handleAddPackage} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Pacote
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isEditing={editingPackage === pkg.id}
                onEdit={() => setEditingPackage(pkg.id)}
                onSave={handleSavePackage}
                onCancel={() => setEditingPackage(null)}
                onDelete={() => handleDeletePackage(pkg.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planos de Assinatura Mensal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            ⚡ Planos de Assinatura Mensal
          </CardTitle>
          <Button onClick={handleAddSubscription} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Plano
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                isEditing={editingSubscription === sub.id}
                onEdit={() => setEditingSubscription(sub.id)}
                onSave={handleSaveSubscription}
                onCancel={() => setEditingSubscription(null)}
                onDelete={() => handleDeleteSubscription(sub.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface PackageCardProps {
  package: CreditPackage;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (id: string, credits: number, price: number, popular: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  const [credits, setCredits] = useState(pkg.credits);
  const [price, setPrice] = useState(pkg.price);
  const [popular, setPopular] = useState(pkg.popular);

  const handleSave = () => {
    onSave(pkg.id, credits, price, popular);
  };

  if (isEditing) {
    return (
      <Card className="relative">
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <Label>Créditos</Label>
            <Input
              type="number"
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Preço (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Popular</Label>
            <Switch
              checked={popular}
              onCheckedChange={setPopular}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Save className="w-3 h-3 mr-1" />
              Salvar
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm" className="flex-1">
              <X className="w-3 h-3 mr-1" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`relative ${pkg.popular ? 'border-blue-500' : ''}`}>
      {pkg.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
          Popular
        </Badge>
      )}
      
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold">{pkg.credits}</div>
        <div className="text-sm text-gray-500">créditos</div>
        
        <div className="text-lg font-semibold text-green-600 mt-2">
          R$ {pkg.price.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500">
          R$ {(pkg.price / pkg.credits).toFixed(3)}/crédito
        </div>

        <div className="flex gap-1 mt-3">
          <Button onClick={onEdit} variant="outline" size="sm" className="flex-1">
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button onClick={onDelete} variant="destructive" size="sm" className="flex-1">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface SubscriptionCardProps {
  subscription: SubscriptionPlan;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (id: string, monthlyCredits: number, price: number, popular: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription: sub,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  const [monthlyCredits, setMonthlyCredits] = useState(sub.monthlyCredits);
  const [price, setPrice] = useState(sub.price);
  const [popular, setPopular] = useState(sub.popular);

  const handleSave = () => {
    onSave(sub.id, monthlyCredits, price, popular);
  };

  if (isEditing) {
    return (
      <Card className="relative">
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <Label>Créditos Mensais</Label>
            <Input
              type="number"
              value={monthlyCredits}
              onChange={(e) => setMonthlyCredits(parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Preço Mensal (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Recomendado</Label>
            <Switch
              checked={popular}
              onCheckedChange={setPopular}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Save className="w-3 h-3 mr-1" />
              Salvar
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm" className="flex-1">
              <X className="w-3 h-3 mr-1" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`relative ${sub.popular ? 'border-blue-500' : ''}`}>
      {sub.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
          Recomendado
        </Badge>
      )}
      
      <CardContent className="p-6 text-center">
        <div className="text-3xl font-bold">+{sub.monthlyCredits}</div>
        <div className="text-sm text-gray-500">créditos extras/mês</div>
        
        <div className="text-xl font-semibold text-green-600 mt-4">
          R$ {sub.price.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">/mês</div>
        <div className="text-xs text-gray-500 mt-1">
          R$ {(sub.price / sub.monthlyCredits).toFixed(3)}/crédito
        </div>

        <div className="flex gap-1 mt-4">
          <Button onClick={onEdit} variant="outline" size="sm" className="flex-1">
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button onClick={onDelete} variant="destructive" size="sm" className="flex-1">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableCreditPackages;
