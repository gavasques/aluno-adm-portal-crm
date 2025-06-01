import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Edit, X } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { useCustomFieldValues } from '@/hooks/crm/useCustomFieldValues';
import { toast } from 'sonner';

interface LeadDataTabProps {
  lead: CRMLead;
  onUpdate?: () => void;
}

const LeadDataTab = ({ lead, onUpdate }: LeadDataTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { tags } = useCRMTags();
  const { updateLead, updateLeadTags, updating } = useCRMLeadUpdate();
  const { customFields } = useCRMCustomFields();
  const { fieldValues, getFormValues, prepareFieldValues, saveFieldValues } = useCustomFieldValues(lead.id);
  
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
    notes: lead.notes || '',
    ...getFormValues() // Adicionar valores dos campos customizáveis
  });

  const [selectedTags, setSelectedTags] = useState<string[]>(
    lead.tags?.map(tag => tag.id) || []
  );

  const handleSave = async () => {
    try {
      // Separar dados padrão dos campos customizáveis
      const standardData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        has_company: formData.has_company,
        what_sells: formData.what_sells,
        keep_or_new_niches: formData.keep_or_new_niches,
        sells_on_amazon: formData.sells_on_amazon,
        amazon_store_link: formData.amazon_store_link,
        amazon_state: formData.amazon_state,
        amazon_tax_regime: formData.amazon_tax_regime,
        works_with_fba: formData.works_with_fba,
        had_contact_with_lv: formData.had_contact_with_lv,
        seeks_private_label: formData.seeks_private_label,
        main_doubts: formData.main_doubts,
        ready_to_invest_3k: formData.ready_to_invest_3k,
        calendly_scheduled: formData.calendly_scheduled,
        calendly_link: formData.calendly_link,
        notes: formData.notes
      };

      const success = await updateLead(lead.id, standardData);
      if (success) {
        await updateLeadTags(lead.id, selectedTags);
        
        // Salvar campos customizáveis
        if (customFields.length > 0) {
          const fieldValues = prepareFieldValues(formData, customFields);
          await saveFieldValues.mutateAsync(fieldValues);
        }
        
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
      notes: lead.notes || '',
      ...getFormValues()
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

  const renderCustomField = (fieldValue: any) => {
    const field = fieldValue.field;
    if (!field) return null;

    const fieldKey = `custom_field_${field.field_key}`;
    const value = formData[fieldKey];

    if (isEditing) {
      switch (field.field_type) {
        case 'text':
          return (
            <div key={field.id}>
              <Label htmlFor={fieldKey}>{field.field_name}</Label>
              <Input
                id={fieldKey}
                value={value || ''}
                onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                placeholder={field.placeholder}
              />
            </div>
          );

        case 'number':
          return (
            <div key={field.id}>
              <Label htmlFor={fieldKey}>{field.field_name}</Label>
              <Input
                id={fieldKey}
                type="number"
                value={value || ''}
                onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                placeholder={field.placeholder}
              />
            </div>
          );

        case 'phone':
          return (
            <div key={field.id}>
              <Label htmlFor={fieldKey}>{field.field_name}</Label>
              <Input
                id={fieldKey}
                type="tel"
                value={value || ''}
                onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                placeholder={field.placeholder}
              />
            </div>
          );

        case 'boolean':
          return (
            <div key={field.id} className="flex items-center justify-between">
              <Label htmlFor={fieldKey}>{field.field_name}</Label>
              <Switch
                id={fieldKey}
                checked={value || false}
                onCheckedChange={(checked) => setFormData({...formData, [fieldKey]: checked})}
              />
            </div>
          );

        case 'select':
          return (
            <div key={field.id}>
              <Label htmlFor={fieldKey}>{field.field_name}</Label>
              <Select
                value={value || ''}
                onValueChange={(selectedValue) => setFormData({...formData, [fieldKey]: selectedValue})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option: string, index: number) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );

        default:
          return null;
      }
    } else {
      // Modo visualização
      let displayValue = value;
      
      if (field.field_type === 'boolean') {
        displayValue = value ? 'Sim' : 'Não';
      } else if (!value) {
        displayValue = 'Não informado';
      }

      return (
        <div key={field.id}>
          <Label>{field.field_name}</Label>
          <p className="text-sm text-gray-600 mt-1">{displayValue}</p>
        </div>
      );
    }
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

        {/* Tags - APENAS SELEÇÃO, SEM OPÇÃO DE CRIAR */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <Label className="text-sm text-gray-700">Selecione as tags aplicáveis:</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer hover:shadow-sm transition-all"
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
                {tags.length === 0 && (
                  <p className="text-sm text-gray-500">Nenhuma tag disponível. Entre em contato com o administrador para criar tags.</p>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lead.tags && lead.tags.length > 0 ? (
                  lead.tags.map(tag => (
                    <Badge
                      key={tag.id}
                      style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color + '40' }}
                    >
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma tag adicionada</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campos Customizáveis */}
        {fieldValues.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Campos Customizáveis</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldValues.map(renderCustomField)}
            </CardContent>
          </Card>
        )}

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
