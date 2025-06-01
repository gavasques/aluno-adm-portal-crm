
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditableFieldProps {
  value: any;
  onChange: (value: any) => void;
  type: 'text' | 'textarea' | 'boolean' | 'select' | 'phone' | 'number';
  options?: string[];
  placeholder?: string;
  isEditing: boolean;
  renderDisplay?: (value: any) => React.ReactNode;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  type,
  options = [],
  placeholder,
  isEditing,
  renderDisplay
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  if (!isEditing) {
    if (renderDisplay) {
      return <>{renderDisplay(value)}</>;
    }

    // Renderização padrão para visualização
    switch (type) {
      case 'boolean':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {value ? 'Sim' : 'Não'}
          </span>
        );
      case 'textarea':
        return (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {value || <span className="text-gray-400 italic">Não informado</span>}
          </p>
        );
      default:
        return (
          <span className="font-medium">
            {value || <span className="text-gray-400 italic">Não informado</span>}
          </span>
        );
    }
  }

  // Renderização para modo de edição
  switch (type) {
    case 'boolean':
      return (
        <Switch
          checked={localValue || false}
          onCheckedChange={handleChange}
        />
      );

    case 'textarea':
      return (
        <Textarea
          value={localValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full"
        />
      );

    case 'select':
      return (
        <Select
          value={localValue || ''}
          onValueChange={handleChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder || 'Selecione uma opção'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'number':
      return (
        <Input
          type="number"
          value={localValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
      );

    case 'phone':
      return (
        <Input
          type="tel"
          value={localValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || "(00) 00000-0000"}
          className="w-full"
        />
      );

    case 'text':
    default:
      return (
        <Input
          type="text"
          value={localValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
      );
  }
};
