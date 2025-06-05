
import React from 'react';
import { CRMLead, CRMLeadCardField } from '@/types/crm.types';
import { FieldRenderer } from './FieldRenderer';

interface ConfigurableCardLayoutProps {
  lead: CRMLead;
  visibleFields: CRMLeadCardField[];
  fieldOrder: CRMLeadCardField[];
}

export const ConfigurableCardLayout: React.FC<ConfigurableCardLayoutProps> = ({
  lead,
  visibleFields,
  fieldOrder
}) => {
  // Ordenar campos conforme preferência do usuário
  const orderedVisibleFields = fieldOrder.filter(field => visibleFields.includes(field));
  
  // Separar campos por categoria para organização
  const essentialFields = orderedVisibleFields.filter(field => 
    ['name', 'status', 'responsible'].includes(field)
  );
  
  const contactFields = orderedVisibleFields.filter(field => 
    ['phone', 'email'].includes(field)
  );
  
  const qualificationFields = orderedVisibleFields.filter(field => 
    ['has_company', 'sells_on_amazon', 'works_with_fba', 'seeks_private_label', 'ready_to_invest_3k', 'calendly_scheduled'].includes(field)
  );
  
  const amazonFields = orderedVisibleFields.filter(field => 
    ['what_sells', 'amazon_state', 'amazon_tax_regime', 'amazon_store_link', 'keep_or_new_niches'].includes(field)
  );
  
  const otherFields = orderedVisibleFields.filter(field => 
    ['main_doubts', 'notes', 'calendly_link'].includes(field)
  );
  
  const systemFields = orderedVisibleFields.filter(field => 
    ['pipeline', 'column', 'tags', 'created_at', 'updated_at', 'scheduled_contact_date'].includes(field)
  );

  // Função para verificar se uma seção tem conteúdo válido
  const hasValidContent = (fields: CRMLeadCardField[]) => {
    return fields.some(field => {
      const fieldContent = getFieldContent(field, lead);
      return fieldContent !== null && fieldContent !== undefined && fieldContent !== '';
    });
  };

  const getFieldContent = (field: CRMLeadCardField, lead: CRMLead) => {
    switch (field) {
      case 'name': return lead.name;
      case 'email': return lead.email;
      case 'phone': return lead.phone;
      case 'status': return lead.status;
      case 'responsible': return lead.responsible?.name;
      case 'pipeline': return lead.pipeline?.name;
      case 'column': return lead.column?.name;
      case 'tags': return lead.tags && lead.tags.length > 0;
      case 'has_company': return lead.has_company;
      case 'sells_on_amazon': return lead.sells_on_amazon;
      case 'works_with_fba': return lead.works_with_fba;
      case 'seeks_private_label': return lead.seeks_private_label;
      case 'ready_to_invest_3k': return lead.ready_to_invest_3k;
      case 'calendly_scheduled': return lead.calendly_scheduled;
      case 'what_sells': return lead.what_sells;
      case 'amazon_state': return lead.amazon_state;
      case 'amazon_tax_regime': return lead.amazon_tax_regime;
      case 'amazon_store_link': return lead.amazon_store_link;
      case 'keep_or_new_niches': return lead.keep_or_new_niches;
      case 'main_doubts': return lead.main_doubts;
      case 'notes': return lead.notes;
      case 'calendly_link': return lead.calendly_link;
      case 'created_at': return lead.created_at;
      case 'updated_at': return lead.updated_at;
      case 'scheduled_contact_date': return lead.scheduled_contact_date;
      default: return null;
    }
  };

  return (
    <div className="space-y-2">
      {/* Campos Essenciais - Sempre renderizar se estiverem na lista */}
      {essentialFields.map(field => (
        <FieldRenderer 
          key={field} 
          field={field} 
          lead={lead} 
          compact={true}
        />
      ))}

      {/* Campos de Contato - Apenas se tiverem conteúdo */}
      {hasValidContent(contactFields) && (
        <div className="space-y-1">
          {contactFields.map(field => (
            <FieldRenderer 
              key={field} 
              field={field} 
              lead={lead} 
              compact={true}
            />
          ))}
        </div>
      )}

      {/* Campos de Qualificação - Como badges compactos em linha */}
      {hasValidContent(qualificationFields) && (
        <div className="flex flex-wrap gap-1">
          {qualificationFields.map(field => (
            <FieldRenderer 
              key={field} 
              field={field} 
              lead={lead} 
              compact={true}
            />
          ))}
        </div>
      )}

      {/* Campos Amazon */}
      {hasValidContent(amazonFields) && (
        <div className="space-y-1">
          {amazonFields.map(field => (
            <FieldRenderer 
              key={field} 
              field={field} 
              lead={lead} 
              compact={true}
            />
          ))}
        </div>
      )}

      {/* Outros campos */}
      {hasValidContent(otherFields) && (
        <div className="space-y-1">
          {otherFields.map(field => (
            <FieldRenderer 
              key={field} 
              field={field} 
              lead={lead} 
              compact={true}
            />
          ))}
        </div>
      )}

      {/* Tags - tratamento especial */}
      {systemFields.includes('tags') && lead.tags && lead.tags.length > 0 && (
        <FieldRenderer 
          field="tags" 
          lead={lead} 
          compact={true}
        />
      )}

      {/* Outros campos do sistema */}
      {systemFields.filter(f => f !== 'tags').map(field => {
        const content = getFieldContent(field, lead);
        if (!content) return null;
        
        return (
          <FieldRenderer 
            key={field} 
            field={field} 
            lead={lead} 
            compact={true}
          />
        );
      })}
    </div>
  );
};
