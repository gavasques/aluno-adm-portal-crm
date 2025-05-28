
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SoftwareType } from "@/hooks/admin/useSoftwareTypes";

interface EditSoftwareTypeFormProps {
  softwareType: SoftwareType;
  onSubmit: (data: { name: string; description?: string }) => void;
  isLoading?: boolean;
}

const EditSoftwareTypeForm: React.FC<EditSoftwareTypeFormProps> = ({
  softwareType,
  onSubmit,
  isLoading = false
}) => {
  const [name, setName] = useState(softwareType.name);
  const [description, setDescription] = useState(softwareType.description || "");

  useEffect(() => {
    setName(softwareType.name);
    setDescription(softwareType.description || "");
  }, [softwareType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Nome do Tipo de Ferramenta *</Label>
        <Input
          id="edit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome do tipo de ferramenta"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Descrição</Label>
        <Textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite uma descrição para o tipo de ferramenta (opcional)"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
};

export default EditSoftwareTypeForm;
