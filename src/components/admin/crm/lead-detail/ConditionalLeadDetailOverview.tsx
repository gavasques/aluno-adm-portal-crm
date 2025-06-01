
import React, { useState, useEffect } from 'react';
import { CRMLead } from '@/types/crm.types';
import { CRMCustomField, CRMCustomFieldValue, CRMCustomFieldGroup } from '@/types/crm-custom-fields.types';
import { 
  Building2, 
  ShoppingCart, 
  Package, 
  Target,
  Calendar,
  Globe,
  FileText,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCRMFieldVisibility } from '@/hooks/crm/useCRMFieldVisibility';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { useCRMCustomFieldValues } from '@/hooks/crm/useCRMCustomFieldValues';
import { EditableField } from './EditableField';
import { CustomFieldRenderer } from './CustomFieldRenderer';
import { toast } from 'sonner';

interface LeadDetailData extends CRMLead {
  customFields?: CRMCustomField[];
  customFieldValues?: CRMCustomFieldValue[];
}

interface ConditionalLeadDetailOverviewProps {
  lead: LeadDetailData;
  isEditing: boolean;
  onDataChange: (hasChanges: boolean) => void;
  onLeadUpdate: () => void;
}

export const ConditionalLeadDetailOverview = ({ 
  lead, 
  isEditing, 
  onDataChange, 
  onLeadUpdate 
}: ConditionalLeadDetailOverviewProps) => {
  const { config, loading } = useCRMFieldVisibility();
  const { updateLead } = useCRMLeadUpdate();
  const { saveCustomFieldValue } = useCRMCustomFieldValues();

  // Estados para os dados editáveis
  const [editableData, setEditableData] = useState({
    // Dados básicos
    has_company: lead.has_company,
    sells_on_amazon: lead.sells_on_amazon,
    works_with_fba: lead.works_with_fba,
    seeks_private_label: lead.seeks_private_label,
    ready_to_invest_3k: lead.ready_to_invest_3k,
    had_contact_with_lv: lead.had_contact_with_lv,
    calendly_scheduled: lead.calendly_scheduled,
    
    // Dados de texto
    what_sells: lead.what_sells || '',
    keep_or_new_niches: lead.keep_or_new_niches || '',
    amazon_store_link: lead.amazon_store_link || '',
    amazon_state: lead.amazon_state || '',
    amazon_tax_regime: lead.amazon_tax_regime || '',
    main_doubts: lead.main_doubts || '',
    notes: lead.notes || '',
    calendly_link: lead.calendly_link || ''
  });

  // Estados para campos customizados
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});

  // Inicializar valores dos campos customizados
  useEffect(() => {
    if (lead.customFieldValues) {
      const values: Record<string, string> = {};
      lead.customFieldValues.forEach(value => {
        if (value.field_value) {
          values[value.field_id] = value.field_value;
        }
      });
      setCustomFieldValues(values);
    }
  }, [lead.customFieldValues]);

  // Verificar se há mudanças
  useEffect(() => {
    const hasBasicChanges = JSON.stringify(editableData) !== JSON.stringify({
      has_company: lead.has_company,
      sells_on_amazon: lead.sells_on_amazon,
      works_with_fba: lead.works_with_fba,
      seeks_private_label: lead.seeks_private_label,
      ready_to_invest_3k: lead.ready_to_invest_3k,
      had_contact_with_lv: lead.had_contact_with_lv,
      calendly_scheduled: lead.calendly_scheduled,
      what_sells: lead.what_sells || '',
      keep_or_new_niches: lead.keep_or_new_niches || '',
      amazon_store_link: lead.amazon_store_link || '',
      amazon_state: lead.amazon_state || '',
      amazon_tax_regime: lead.amazon_tax_regime || '',
      main_doubts: lead.main_doubts || '',
      notes: lead.notes || '',
      calendly_link: lead.calendly_link || ''
    });

    const originalCustomValues: Record<string, string> = {};
    if (lead.customFieldValues) {
      lead.customFieldValues.forEach(value => {
        if (value.field_value) {
          originalCustomValues[value.field_id] = value.field_value;
        }
      });
    }
    const hasCustomChanges = JSON.stringify(customFieldValues) !== JSON.stringify(originalCustomValues);

    onDataChange(hasBasicChanges || hasCustomChanges);
  }, [editableData, customFieldValues, lead, onDataChange]);

  // Função para salvar as alterações
  const handleSave = async () => {
    try {
      // Salvar dados básicos do lead
      await updateLead(lead.id, editableData);

      // Salvar campos customizados
      const customPromises = Object.entries(customFieldValues).map(([fieldId, value]) => 
        saveCustomFieldValue(lead.id, fieldId, value)
      );
      
      await Promise.all(customPromises);

      toast.success('Lead atualizado com sucesso!');
      onLeadUpdate();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar as alterações');
    }
  };

  // Registrar função de salvar no componente pai
  useEffect(() => {
    if (isEditing) {
      (window as any).saveLeadData = handleSave;
    }
    return () => {
      delete (window as any).saveLeadData;
    };
  }, [isEditing, editableData, customFieldValues]);

  const handleFieldChange = (field: string, value: any) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const InfoCard = ({ 
    icon: Icon, 
    title, 
    content, 
    color = "blue" 
  }: { 
    icon: any; 
    title: string; 
    content: React.ReactNode; 
    color?: string; 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg ${
        isEditing ? 'ring-2 ring-blue-200/50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-gray-700">{content}</div>
        </div>
      </div>
    </motion.div>
  );

  // Agrupar campos customizados por grupo
  const groupCustomFields = () => {
    if (!lead.customFields || !lead.customFieldValues) return {};

    const groups: Record<string, { group: CRMCustomFieldGroup; fields: Array<{ field: CRMCustomField; value?: CRMCustomFieldValue }> }> = {};

    lead.customFields.forEach(field => {
      if (!field.group || !field.group.is_active) return;

      const groupName = field.group.name;
      if (!groups[groupName]) {
        groups[groupName] = {
          group: field.group,
          fields: []
        };
      }

      const fieldValue = lead.customFieldValues?.find(v => v.field_id === field.id);
      groups[groupName].fields.push({ field, value: fieldValue });
    });

    return groups;
  };

  const customFieldGroups = groupCustomFields();

  if (loading) {
    return <div className="p-6">Carregando configuração...</div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-blue-50/30 to-purple-50/30 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Empresa */}
        {config.business_section && (
          <InfoCard
            icon={Building2}
            title="Informações da Empresa"
            color="blue"
            content={
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tem empresa:</span>
                  <EditableField
                    value={editableData.has_company}
                    onChange={(value) => handleFieldChange('has_company', value)}
                    type="boolean"
                    isEditing={isEditing}
                  />
                </div>
                {config.amazon_section && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estado (Amazon):</span>
                      <EditableField
                        value={editableData.amazon_state}
                        onChange={(value) => handleFieldChange('amazon_state', value)}
                        type="text"
                        placeholder="Estado"
                        isEditing={isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Regime Tributário:</span>
                      <EditableField
                        value={editableData.amazon_tax_regime}
                        onChange={(value) => handleFieldChange('amazon_tax_regime', value)}
                        type="text"
                        placeholder="Regime tributário"
                        isEditing={isEditing}
                      />
                    </div>
                  </>
                )}
              </div>
            }
          />
        )}

        {/* Amazon e E-commerce */}
        {config.amazon_section && (
          <InfoCard
            icon={ShoppingCart}
            title="Amazon e E-commerce"
            color="orange"
            content={
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vende na Amazon:</span>
                  <EditableField
                    value={editableData.sells_on_amazon}
                    onChange={(value) => handleFieldChange('sells_on_amazon', value)}
                    type="boolean"
                    isEditing={isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trabalha com FBA:</span>
                  <EditableField
                    value={editableData.works_with_fba}
                    onChange={(value) => handleFieldChange('works_with_fba', value)}
                    type="boolean"
                    isEditing={isEditing}
                  />
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Link da Loja:</span>
                  <EditableField
                    value={editableData.amazon_store_link}
                    onChange={(value) => handleFieldChange('amazon_store_link', value)}
                    type="text"
                    placeholder="https://amazon.com/..."
                    isEditing={isEditing}
                    renderDisplay={(value) => value ? (
                      <a 
                        href={value} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Não informado</span>
                    )}
                  />
                </div>
              </div>
            }
          />
        )}

        {/* Produtos e Negócio */}
        <InfoCard
          icon={Package}
          title="Produtos e Negócio"
          color="green"
          content={
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 block mb-1">O que vende:</span>
                <EditableField
                  value={editableData.what_sells}
                  onChange={(value) => handleFieldChange('what_sells', value)}
                  type="textarea"
                  placeholder="Descreva os produtos vendidos"
                  isEditing={isEditing}
                />
              </div>
              <div>
                <span className="text-sm text-gray-600 block mb-1">Nichos:</span>
                <EditableField
                  value={editableData.keep_or_new_niches}
                  onChange={(value) => handleFieldChange('keep_or_new_niches', value)}
                  type="textarea"
                  placeholder="Descreva os nichos"
                  isEditing={isEditing}
                />
              </div>
            </div>
          }
        />

        {/* Qualificação */}
        {config.qualification_section && (
          <InfoCard
            icon={Target}
            title="Qualificação"
            color="purple"
            content={
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Busca marca própria:</span>
                  <EditableField
                    value={editableData.seeks_private_label}
                    onChange={(value) => handleFieldChange('seeks_private_label', value)}
                    type="boolean"
                    isEditing={isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pronto para investir 3k:</span>
                  <EditableField
                    value={editableData.ready_to_invest_3k}
                    onChange={(value) => handleFieldChange('ready_to_invest_3k', value)}
                    type="boolean"
                    isEditing={isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Teve contato com LV:</span>
                  <EditableField
                    value={editableData.had_contact_with_lv}
                    onChange={(value) => handleFieldChange('had_contact_with_lv', value)}
                    type="boolean"
                    isEditing={isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Calendly agendado:</span>
                  <EditableField
                    value={editableData.calendly_scheduled}
                    onChange={(value) => handleFieldChange('calendly_scheduled', value)}
                    type="boolean"
                    isEditing={isEditing}
                  />
                </div>
              </div>
            }
          />
        )}

        {/* Datas Importantes */}
        {(lead.scheduled_contact_date || lead.created_at) && (
          <InfoCard
            icon={Calendar}
            title="Datas Importantes"
            color="indigo"
            content={
              <div className="space-y-3">
                {lead.scheduled_contact_date && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Próximo contato:</span>
                    <span className="font-medium">
                      {format(new Date(lead.scheduled_contact_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Criado em:</span>
                  <span className="font-medium">
                    {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
              </div>
            }
          />
        )}

        {/* Links e Calendly */}
        <InfoCard
          icon={Globe}
          title="Links"
          color="teal"
          content={
            <div>
              <span className="text-sm text-gray-600 block mb-1">Link do Calendly:</span>
              <EditableField
                value={editableData.calendly_link}
                onChange={(value) => handleFieldChange('calendly_link', value)}
                type="text"
                placeholder="https://calendly.com/..."
                isEditing={isEditing}
                renderDisplay={(value) => value ? (
                  <a 
                    href={value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Não informado</span>
                )}
              />
            </div>
          }
        />

        {/* Campos Customizados Agrupados */}
        {Object.entries(customFieldGroups).map(([groupName, groupData]) => (
          <InfoCard
            key={groupName}
            icon={Settings}
            title={groupData.group.name}
            color="slate"
            content={
              <div className="space-y-3">
                {groupData.fields.map(({ field, value }) => (
                  <div key={field.id}>
                    {isEditing ? (
                      <div className="space-y-2">
                        <span className="text-sm text-gray-600">{field.field_name}:</span>
                        <EditableField
                          value={customFieldValues[field.id] || ''}
                          onChange={(val) => handleCustomFieldChange(field.id, val)}
                          type={field.field_type}
                          options={field.options}
                          placeholder={field.placeholder}
                          isEditing={true}
                        />
                      </div>
                    ) : (
                      <CustomFieldRenderer
                        field={field}
                        value={value}
                      />
                    )}
                  </div>
                ))}
              </div>
            }
          />
        ))}
      </div>

      {/* Observações */}
      {config.notes_section && (
        <div className="mt-6 space-y-4">
          <InfoCard
            icon={FileText}
            title="Principais Dúvidas"
            color="amber"
            content={
              <EditableField
                value={editableData.main_doubts}
                onChange={(value) => handleFieldChange('main_doubts', value)}
                type="textarea"
                placeholder="Principais dúvidas do lead"
                isEditing={isEditing}
              />
            }
          />
          
          <InfoCard
            icon={FileText}
            title="Observações"
            color="gray"
            content={
              <EditableField
                value={editableData.notes}
                onChange={(value) => handleFieldChange('notes', value)}
                type="textarea"
                placeholder="Observações sobre o lead"
                isEditing={isEditing}
              />
            }
          />
        </div>
      )}

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="mt-6">
          <InfoCard
            icon={Target}
            title="Tags"
            color="pink"
            content={
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: tag.color + '20', 
                      color: tag.color,
                      border: `1px solid ${tag.color}40`
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};
