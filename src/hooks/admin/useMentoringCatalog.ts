
import { useState } from "react";
import { toast } from "sonner";
import { MentoriaCatalogo, MentoringFormData } from "@/types/mentoring.types";

// Mock data for testing
const mockMentoringCatalog: MentoriaCatalogo[] = [
  {
    id: "1",
    nome_mentoria: "Mentoria Individual E-commerce",
    descricao: "Mentoria personalizada para quem quer começar no e-commerce",
    tipo_mentoria: "INDIVIDUAL",
    instrutor_principal_id: "instructor1",
    instrutor_principal_nome: "Ana Silva",
    duracao_acesso_dias: 90,
    sessoes_padrao_individual: 6,
    preco: 1500.00,
    ativo: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "2",
    nome_mentoria: "Imersão em Grupo - Ads Pro",
    descricao: "Programa intensivo de anúncios para grupos",
    tipo_mentoria: "GRUPO",
    instrutor_principal_id: "instructor2",
    instrutor_principal_nome: "Carlos Santos",
    duracao_acesso_dias: 60,
    preco: 800.00,
    ativo: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "3",
    nome_mentoria: "Mentoria Individual Avançada",
    descricao: "Para quem já tem experiência e quer escalar",
    tipo_mentoria: "INDIVIDUAL",
    instrutor_principal_id: "instructor1",
    instrutor_principal_nome: "Ana Silva",
    duracao_acesso_dias: 120,
    sessoes_padrao_individual: 10,
    preco: 2500.00,
    ativo: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  }
];

export const useMentoringCatalog = () => {
  const [mentoringItems, setMentoringItems] = useState<MentoriaCatalogo[]>(mockMentoringCatalog);
  const [loading, setLoading] = useState(false);

  const fetchMentoringCatalog = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMentoringItems(mockMentoringCatalog);
      setLoading(false);
    }, 500);
  };

  const addMentoringItem = async (data: MentoringFormData) => {
    try {
      const newItem: MentoriaCatalogo = {
        id: Date.now().toString(),
        ...data,
        ativo: true,
        instrutor_principal_nome: "Instrutor Teste",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setMentoringItems(prev => [...prev, newItem]);
      toast.success("Mentoria criada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao criar mentoria");
      return false;
    }
  };

  const updateMentoringItem = async (id: string, data: Partial<MentoriaCatalogo>) => {
    try {
      setMentoringItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...data, updated_at: new Date().toISOString() }
            : item
        )
      );
      toast.success("Mentoria atualizada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar mentoria");
      return false;
    }
  };

  const deleteMentoringItem = async (id: string) => {
    try {
      setMentoringItems(prev => prev.filter(item => item.id !== id));
      toast.success("Mentoria excluída com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao excluir mentoria");
      return false;
    }
  };

  return {
    mentoringItems,
    loading,
    fetchMentoringCatalog,
    addMentoringItem,
    updateMentoringItem,
    deleteMentoringItem
  };
};
