
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
  
  // Determinar layout baseado no número de campos
  const fieldCount = orderedVisibleFields.length;
  const isCompact = fieldCount <= 4;
  
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
    ['what_sells', 'amazon_state'].includes(field)
  );
  
  const systemFields = orderedVisibleFields.filter(field => 
    ['pipeline', 'column', 'tags', 'created_at', 'updated_at', 'scheduled_contact_date'].includes(field)
  );

  const spacingClass = isCompact ? 'space-y-2' : 'space-y-3';

  return (
    <div className={spacingClass}>
      {/* Campos Essenciais - Sempre no topo */}
      {essentialFields.length > 0 && (
        <div className="space-y-2">
          {essentialFields.map(field => (
            <FieldRenderer 
              key={field} 
              field={field} 
              lead={lead} 
              compact={isCompact}
            />
          ))}
        </div>
      )}

      {/* Campos de Contato */}
      {contactFields.length > 0 && (
        <div className="space-y-1">
          {contactFields.map(field => (
            <FieldRenderer 
              key={field} 
              field={field} 
              lead={lead} 
              compact={isCompact}
            />
          ))}
        </div>
      )}

      {/* Campos de Qualificação - Como badges em linha */}
      {qualificationFields.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {qualificationFields.map(field => (
            <FieldRenderer 
              key={field} 
              field={field} 
              lead={lead} 
              compact={isCompact}
            />
          ))}
        </div>
      )}

      {/* Campos Amazon */}
      {amazonFields.length > 0 && (
        <div className="space-y-1">
          {amazonFields.map(field => (
            <FieldRenderer 
              key={field} 
              field={field} 
              lead={lead} 
              compact={isCompact}
            />
          ))}
        </div>
      )}

      {/* Tags */}
      {systemFields.includes('tags') && (
        <FieldRenderer 
          field="tags" 
          lead={lead} 
          compact={isCompact}
        />
      )}

      {/* Outros campos do sistema */}
      {systemFields.filter(f => f !== 'tags').map(field => (
        <FieldRenderer 
          key={field} 
          field={field} 
          lead={lead} 
          compact={isCompact}
        />
      ))}
    </div>
  );
};
