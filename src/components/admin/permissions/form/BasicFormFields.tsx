
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isLoading: boolean;
  isSubmitting: boolean;
}

export const BasicFormFields: React.FC<BasicFormFieldsProps> = ({
  name,
  setName,
  description,
  setDescription,
  isLoading,
  isSubmitting,
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Nome do Grupo</Label>
        <Input
          id="name"
          placeholder="Ex: Gerentes de Marketing"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading || isSubmitting}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição das permissões deste grupo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading || isSubmitting}
        />
      </div>
    </>
  );
};
