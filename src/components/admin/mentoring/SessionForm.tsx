
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MentoriaEncontroSessao, SessionFormData } from "@/types/mentoring.types";

interface SessionFormProps {
  session?: MentoriaEncontroSessao;
  onSubmit: (data: SessionFormData) => Promise<boolean>;
  onCancel: () => void;
  isGroupSession?: boolean;
}

const SessionForm: React.FC<SessionFormProps> = ({ session, onSubmit, onCancel, isGroupSession = false }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SessionFormData>({
    defaultValues: session ? {
      titulo_encontro_sessao: session.titulo_encontro_sessao,
      descricao_detalhada: session.descricao_detalhada || "",
      data_hora_agendada: session.data_hora_agendada ? new Date(session.data_hora_agendada).toISOString().slice(0, 16) : "",
      duracao_estimada_min: session.duracao_estimada_min || 60,
      link_plataforma_online: session.link_plataforma_online || "",
      status_encontro_sessao: session.status_encontro_sessao
    } : {
      titulo_encontro_sessao: "",
      descricao_detalhada: "",
      data_hora_agendada: "",
      duracao_estimada_min: 60,
      link_plataforma_online: "",
      status_encontro_sessao: "AGENDADO"
    }
  });

  const handleFormSubmit = async (data: SessionFormData) => {
    const success = await onSubmit(data);
    if (success) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="titulo_encontro_sessao">
          Título do {isGroupSession ? "Encontro" : "Sessão"} *
        </Label>
        <Input
          id="titulo_encontro_sessao"
          {...register("titulo_encontro_sessao", { required: "Título é obrigatório" })}
          placeholder={`Digite o título do ${isGroupSession ? "encontro" : "sessão"}`}
        />
        {errors.titulo_encontro_sessao && (
          <p className="text-sm text-red-500 mt-1">{errors.titulo_encontro_sessao.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="descricao_detalhada">Descrição</Label>
        <Textarea
          id="descricao_detalhada"
          {...register("descricao_detalhada")}
          placeholder="Descreva o que será abordado..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data_hora_agendada">Data e Hora *</Label>
          <Input
            id="data_hora_agendada"
            type="datetime-local"
            {...register("data_hora_agendada", { required: "Data e hora são obrigatórias" })}
          />
          {errors.data_hora_agendada && (
            <p className="text-sm text-red-500 mt-1">{errors.data_hora_agendada.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="duracao_estimada_min">Duração (minutos)</Label>
          <Input
            id="duracao_estimada_min"
            type="number"
            {...register("duracao_estimada_min", { valueAsNumber: true })}
            placeholder="60"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="link_plataforma_online">Link da Plataforma Online</Label>
        <Input
          id="link_plataforma_online"
          {...register("link_plataforma_online")}
          placeholder="https://zoom.us/j/..."
        />
      </div>

      <div>
        <Label htmlFor="status_encontro_sessao">Status</Label>
        <Select
          onValueChange={(value: "AGENDADO" | "REALIZADO" | "CANCELADO") => setValue("status_encontro_sessao", value)}
          defaultValue="AGENDADO"
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AGENDADO">Agendado</SelectItem>
            <SelectItem value="REALIZADO">Realizado</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {session ? "Atualizar" : "Criar"} {isGroupSession ? "Encontro" : "Sessão"}
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
