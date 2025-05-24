
import { useState } from "react";
import { toast } from "sonner";
import { MentoriaMaterialAnexado } from "@/types/mentoring.types";

// Mock data for materials
const mockMaterials: MentoriaMaterialAnexado[] = [
  {
    id: "material1",
    encontro_sessao_id: "session1",
    uploader_id: "instructor1",
    uploader_nome: "Ana Silva",
    nome_arquivo: "Slides_Aula_1.pdf",
    storage_object_path: "mentorias/session1/slides_aula_1.pdf",
    tipo_mime_arquivo: "application/pdf",
    tamanho_arquivo_bytes: 2048000,
    descricao_material: "Slides da primeira aula",
    data_upload: "2025-05-20T10:00:00Z"
  },
  {
    id: "material2",
    encontro_sessao_id: "session2",
    uploader_id: "student1",
    uploader_nome: "João Silva",
    nome_arquivo: "Analise_Perfil.pdf",
    storage_object_path: "mentorias/session2/analise_perfil.pdf",
    tipo_mime_arquivo: "application/pdf",
    tamanho_arquivo_bytes: 1024000,
    descricao_material: "Análise do perfil atual",
    data_upload: "2025-05-21T14:30:00Z"
  }
];

export const useMentoringMaterials = () => {
  const [materials, setMaterials] = useState<MentoriaMaterialAnexado[]>(mockMaterials);
  const [loading, setLoading] = useState(false);

  const fetchMaterials = async (sessionId?: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filteredMaterials = mockMaterials;
      if (sessionId) {
        filteredMaterials = mockMaterials.filter(m => m.encontro_sessao_id === sessionId);
      }
      setMaterials(filteredMaterials);
      setLoading(false);
    }, 300);
  };

  const uploadMaterial = async (sessionId: string, file: File, description?: string) => {
    try {
      // Simulate file upload
      const newMaterial: MentoriaMaterialAnexado = {
        id: Date.now().toString(),
        encontro_sessao_id: sessionId,
        uploader_id: "current-user",
        uploader_nome: "Usuário Atual",
        nome_arquivo: file.name,
        storage_object_path: `mentorias/${sessionId}/${file.name}`,
        tipo_mime_arquivo: file.type,
        tamanho_arquivo_bytes: file.size,
        descricao_material: description,
        data_upload: new Date().toISOString()
      };
      
      setMaterials(prev => [...prev, newMaterial]);
      toast.success("Arquivo enviado com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao enviar arquivo");
      return false;
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      setMaterials(prev => prev.filter(material => material.id !== id));
      toast.success("Arquivo excluído com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao excluir arquivo");
      return false;
    }
  };

  const downloadMaterial = async (material: MentoriaMaterialAnexado) => {
    try {
      // Simulate download
      toast.info(`Baixando ${material.nome_arquivo}...`);
      return true;
    } catch (error) {
      toast.error("Erro ao baixar arquivo");
      return false;
    }
  };

  return {
    materials,
    loading,
    fetchMaterials,
    uploadMaterial,
    deleteMaterial,
    downloadMaterial
  };
};
