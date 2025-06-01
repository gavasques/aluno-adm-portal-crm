
import React from 'react';
import { CRMCustomField, CRMCustomFieldValue } from '@/types/crm-custom-fields.types';

interface CustomFieldRendererProps {
  field: CRMCustomField;
  value?: CRMCustomFieldValue;
}

export const CustomFieldRenderer: React.FC<CustomFieldRendererProps> = ({ field, value }) => {
  const renderFieldValue = () => {
    const fieldValue = value?.field_value;

    if (!fieldValue) {
      return <span className="text-gray-400 italic">Não informado</span>;
    }

    switch (field.field_type) {
      case 'boolean':
        const boolValue = fieldValue === 'true';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            boolValue 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {boolValue ? 'Sim' : 'Não'}
          </span>
        );

      case 'select':
        return <span className="font-medium">{fieldValue}</span>;

      case 'number':
        const numValue = parseFloat(fieldValue);
        return <span className="font-medium">{isNaN(numValue) ? fieldValue : numValue.toLocaleString()}</span>;

      case 'phone':
        return <span className="font-medium">{fieldValue}</span>;

      case 'text':
      default:
        if (fieldValue.length > 100) {
          return (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {fieldValue}
            </p>
          );
        }
        return <span className="font-medium">{fieldValue}</span>;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{field.field_name}:</span>
      <div className="text-right">
        {renderFieldValue()}
      </div>
    </div>
  );
};
