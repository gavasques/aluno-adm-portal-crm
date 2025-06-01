
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SwitchFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({ id, label, checked, onCheckedChange }) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-xs font-medium">{label}</Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};
