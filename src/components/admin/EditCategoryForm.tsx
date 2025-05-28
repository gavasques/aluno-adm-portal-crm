
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/hooks/useCategories";

interface EditCategoryFormProps {
  category: Category;
  onSubmit: (data: { name: string; description?: string }) => void;
  isLoading?: boolean;
}

const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  category,
  onSubmit,
  isLoading = false
}) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");

  useEffect(() => {
    setName(category.name);
    setDescription(category.description || "");
  }, [category]);

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
        <Label htmlFor="edit-name">Nome da Categoria *</Label>
        <Input
          id="edit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome da categoria"
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
          placeholder="Digite uma descrição para a categoria (opcional)"
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

export default EditCategoryForm;
