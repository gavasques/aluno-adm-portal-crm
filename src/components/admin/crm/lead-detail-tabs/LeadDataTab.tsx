
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Save, Edit, X } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { toast } from 'sonner';

interface LeadDataTabProps {
  lead: CRMLead;
  onUpdate?: () => void;
}

const LeadDataTab = ({ lead, onUpdate }: LeadDataTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { tags } = useCRMTags();
  const { updateLead, updateLeadTags, updating } = useCRMLeadUpdate();
  
  const [formData, setFormData] = useState({
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    has_company: lead.has_company || false,
    what_sells: lead.what_sells || '',
    keep_or_new_niches: lead.keep_or_new_niches || '',
    sells_on_amazon: lead.sells_on_amazon || false,
    amazon_store_link: lead.amazon_store_link || '',
    amazon_state: lead.amazon_state || '',
    amazon_tax_regime: lead.amazon_tax_regime || '',
    works_with_fba: lead.works_with_fba || false,
    had_contact_with_lv: lead.had_contact_with_lv || false,
    seeks_private_label: lead.seeks_private_label || false,
    main_doubts: lead.main_doubts || '',
    ready_to_invest_3k: lead.ready_to_invest_3k || false,
    calendly_scheduled: lead.calendly_scheduled || false,
    calendly_link: lead.calendly_link || '',
    notes: lead.notes || ''
  });

  const [selectedTags, setSelectedTags] = useState<string[]>(
    lead.tags?.map(tag => tag.id) || []
  );

  const handleSave = async () => {
    try {
      const success = await updateLead(lead.id, formData);
      if (success) {
        await updateLeadTags(lead.id, selectedTags);
        setIsEditing(false);
        onUpdate?.();
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao atualizar dados');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      has_company: lead.has_company || false,
      what_sells: lead.what_sells || '',
      keep_or_new_niches: lead.keep_or_new_niches || '',
      sells_on_amazon: lead.sells_on_amazon || false,
      amazon_store_link: lead.amazon_store_link || '',
      amazon_state: lead.amazon_state || '',
      amazon_tax_regime: lead.amazon_tax_regime || '',
      works_with_fba: lead.works_with_fba || false,
      had_contact_with_lv: lead.had_contact_with_lv || false,
      seeks_private_label: lead.seeks_private_label || false,
      main_doubts: lead.main_doubts || '',
      ready_to_invest_3k: lead.ready_to_invest_3k || false,
      calendly_scheduled: lead.calendly_scheduled || false,
      calendly_link: lead.calendly_link || '',
      notes: lead.notes || ''
    });
    setSelectedTags(lead.tags?.map(tag => tag.id) || []);
    setIsEditing(false);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dados Completos</h3>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={updating}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updating}>
              <Save className="h-4 w-4 mr-2" />
              {updating ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formData.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formData.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formData.phone || 'Não informado'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações de Negócio */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Negócio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="has_company">Tem empresa?</Label>
              {isEditing ? (
                <Switch
                  id="has_company"
                  checked={formData.has_company}
                  onCheckedChange={(checked) => setFormData({...formData, has_company: checked})}
                />
              ) : (
                <Badge variant={formData.has_company ? "default" : "secondary"}>
                  {formData.has_company ? "Sim" : "Não"}
                </Badge>
              )}
            </div>

            <div>
              <Label htmlFor="what_sells">O que vende?</Label>
              {isEditing ? (
                <Textarea
                  id="what_sells"
                  value={formData.what_sells}
                  onChange={(e) => setFormData({...formData, what_sells: e.target.value})}
                  rows={2}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formData.what_sells || 'Não informado'}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sells_on_amazon">Vende na Amazon?</Label>
              {isEditing ? (
                <Switch
                  id="sells_on_amazon"
                  checked={formData.sells_on_amazon}
                  onCheckedChange={(checked) => setFormData({...formData, sells_on_amazon: checked})}
                />
              ) : (
                <Badge variant={formData.sells_on_amazon ? "default" : "secondary"}>
                  {formData.sells_on_amazon ? "Sim" : "Não"}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ready_to_invest_3k">Pronto para investir R$ 3k?</Label>
              {isEditing ? (
                <Switch
                  id="ready_to_invest_3k"
                  checked={formData.ready_to_invest_3k}
                  onCheckedChange={(checked) => setFormData({...formData, ready_to_invest_3k: checked})}
                />
              ) : (
                <Badge variant={formData.ready_to_invest_3k ? "default" : "secondary"}>
                  {formData.ready_to_invest_3k ? "Sim" : "Não"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    style={{
                      backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                      borderColor: tag.color,
                      color: selectedTags.includes(tag.id) ? 'white' : tag.color
                    }}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lead.tags?.map(tag => (
                  <Badge
                    key={tag.id}
                    style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color + '40' }}
                  >
                    {tag.name}
                  </Badge>
                )) || <p className="text-sm text-gray-500">Nenhuma tag adicionada</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="main_doubts">Principais dúvidas</Label>
              {isEditing ? (
                <Textarea
                  id="main_doubts"
                  value={formData.main_doubts}
                  onChange={(e) => setFormData({...formData, main_doubts: e.target.value})}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formData.main_doubts || 'Nenhuma dúvida registrada'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Observações gerais</Label>
              {isEditing ? (
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formData.notes || 'Nenhuma observação registrada'}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadDataTab;
