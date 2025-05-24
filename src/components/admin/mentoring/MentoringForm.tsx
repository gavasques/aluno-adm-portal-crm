
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MentoriaCatalogo, MentoringFormData } from "@/types/mentoring.types";

interface MentoringFormProps {
  mentoring?: MentoriaCatalogo;
  onSubmit: (data: MentoringFormData) => Promise<boolean>;
  onCancel: () => void;
}

const MentoringForm: React.FC<MentoringFormProps> = ({ mentoring, onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<MentoringFormData>({
    defaultValues: mentoring ? {
      nome_mentoria: mentoring.nome_mentoria,
      descricao: mentoring.descricao || "",
      tipo_mentoria: mentoring.tipo_mentoria,
      instrutor_principal_id: mentoring.instrutor_principal_id || "",
      duracao_acesso_dias: mentoring.duracao_acesso_dias || 30,
      sessoes_padrao_individual: mentoring.sessoes_padrao_individual,
      preco: mentoring.preco || 0
    } : {
      nome_mentoria: "",
      descricao: "",
      tipo_mentoria: "INDIVIDUAL",
      instrutor_principal_id: "",
      duracao_acesso_dias: 30,
      preco: 0
    }
  });

  const tipoMentoria = watch("tipo_mentoria");

  const handleFormSubmit = async (data: MentoringFormData) => {
    const success = await onSubmit(data);
    if (success) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nome_mentoria">Nome da Mentoria *</Label>
        <Input
          id="nome_mentoria"
          {...register("nome_mentoria", { required: "Nome é obrigatório" })}
          placeholder="Digite o nome da mentoria"
        />
        {errors.nome_mentoria && (
          <p className="text-sm text-red-500 mt-1">{errors.nome_mentoria.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          {...register("descricao")}
          placeholder="Descreva a mentoria..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipo_mentoria">Tipo de Mentoria *</Label>
          <Select
            value={tipoMentoria}
            onValueChange={(value: "INDIVIDUAL" | "GRUPO") => setValue("tipo_mentoria", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              <SelectItem value="GRUPO">Grupo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duracao_acesso_dias">Duração do Acesso (dias)</Label>
          <Input
            id="duracao_acesso_dias"
            type="number"
            {...register("duracao_acesso_dias", { valueAsNumber: true })}
            placeholder="30"
          />
        </div>
      </div>

      {tipoMentoria === "INDIVIDUAL" && (
        <div>
          <Label htmlFor="sessoes_padrao_individual">Número de Sessões Incluídas</Label>
          <Input
            id="sessoes_padrao_individual"
            type="number"
            {...register("sessoes_padrao_individual", { valueAsNumber: true })}
            placeholder="6"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="instrutor_principal_id">Instrutor Principal</Label>
          <Select onValueChange={(value) => setValue("instrutor_principal_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o instrutor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instructor1">Ana Silva</SelectItem>
              <SelectItem value="instructor2">Carlos Santos</SelectItem>
              <SelectItem value="instructor3">Marina Costa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="preco">Preço (R$)</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            {...register("preco", { valueAsNumber: true })}
            placeholder="1500.00"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {mentoring ? "Atualizar" : "Criar"} Mentoria
        </Button>
      </div>
    </form>
  );
};

export default MentoringForm;
