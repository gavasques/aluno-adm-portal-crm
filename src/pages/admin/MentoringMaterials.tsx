
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, ExternalLink, FileText, Calendar } from "lucide-react";
import { useMentoringMaterials } from "@/hooks/admin/useMentoringMaterials";
import { useMentoringCatalog } from "@/hooks/admin/useMentoringCatalog";
import { MentoriaMaterialAnexado } from "@/types/mentoring.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Extended mock data with more context
const mockExtendedMaterials: (MentoriaMaterialAnexado & {
  mentoria_nome: string;
  sessao_titulo: string;
  aluno_nome?: string;
})[] = [
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
    data_upload: "2025-05-20T10:00:00Z",
    mentoria_nome: "Imersão em Grupo - Ads Pro",
    sessao_titulo: "Aula 1: Introdução aos Anúncios"
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
    data_upload: "2025-05-21T14:30:00Z",
    mentoria_nome: "Mentoria Individual E-commerce",
    sessao_titulo: "Sessão Individual - Análise de Perfil",
    aluno_nome: "João Silva"
  },
  {
    id: "material3",
    encontro_sessao_id: "session3",
    uploader_id: "instructor2",
    uploader_nome: "Carlos Santos",
    nome_arquivo: "Exercicio_Pratico.docx",
    storage_object_path: "mentorias/session3/exercicio_pratico.docx",
    tipo_mime_arquivo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    tamanho_arquivo_bytes: 512000,
    descricao_material: "Exercício prático da aula 2",
    data_upload: "2025-05-22T16:00:00Z",
    mentoria_nome: "Imersão em Grupo - Ads Pro",
    sessao_titulo: "Aula 2: Configuração de Campanhas"
  }
];

const MentoringMaterials = () => {
  const { downloadMaterial } = useMentoringMaterials();
  const { mentoringItems } = useMentoringCatalog();
  
  const [materials, setMaterials] = useState(mockExtendedMaterials);
  const [filteredMaterials, setFilteredMaterials] = useState(mockExtendedMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMentoria, setSelectedMentoria] = useState<string>("all");
  const [selectedUploader, setSelectedUploader] = useState<string>("all");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    let filtered = materials;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.nome_arquivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.mentoria_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.sessao_titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.uploader_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.aluno_nome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by mentoria
    if (selectedMentoria !== "all") {
      filtered = filtered.filter(material => material.mentoria_nome === selectedMentoria);
    }

    // Filter by uploader
    if (selectedUploader !== "all") {
      filtered = filtered.filter(material => material.uploader_nome === selectedUploader);
    }

    // Filter by file type
    if (selectedFileType !== "all") {
      filtered = filtered.filter(material => {
        const fileType = getFileType(material.tipo_mime_arquivo);
        return fileType === selectedFileType;
      });
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(material => 
        new Date(material.data_upload) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(material => 
        new Date(material.data_upload) <= new Date(dateTo + "T23:59:59")
      );
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, selectedMentoria, selectedUploader, selectedFileType, dateFrom, dateTo]);

  const getFileType = (mimeType?: string) => {
    if (!mimeType) return "Outros";
    if (mimeType.includes('pdf')) return "PDF";
    if (mimeType.includes('word') || mimeType.includes('document')) return "DOC";
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return "XLS";
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return "PPT";
    if (mimeType.includes('image')) return "IMG";
    return "Outros";
  };

  const getFileTypeBadge = (mimeType?: string) => {
    const fileType = getFileType(mimeType);
    const colorMap: Record<string, string> = {
      "PDF": "bg-red-100 text-red-800",
      "DOC": "bg-blue-100 text-blue-800",
      "XLS": "bg-green-100 text-green-800",
      "PPT": "bg-orange-100 text-orange-800",
      "IMG": "bg-purple-100 text-purple-800",
      "Outros": "bg-gray-100 text-gray-800"
    };
    return <Badge className={colorMap[fileType] || colorMap["Outros"]}>{fileType}</Badge>;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMentoria("all");
    setSelectedUploader("all");
    setSelectedFileType("all");
    setDateFrom("");
    setDateTo("");
  };

  const uniqueUploaders = Array.from(new Set(materials.map(m => m.uploader_nome)));
  const uniqueMentorias = Array.from(new Set(materials.map(m => m.mentoria_nome)));

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-portal-dark mb-2">Repositório de Materiais de Mentoria</h1>
        <p className="text-gray-600">Visualize e gerencie todos os materiais anexados às mentorias</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Arquivo, mentoria, sessão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mentoria">Mentoria</Label>
              <Select value={selectedMentoria} onValueChange={setSelectedMentoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {uniqueMentorias.map(mentoria => (
                    <SelectItem key={mentoria} value={mentoria}>{mentoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="uploader">Enviado por</Label>
              <Select value={selectedUploader} onValueChange={setSelectedUploader}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueUploaders.map(uploader => (
                    <SelectItem key={uploader} value={uploader}>{uploader}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fileType">Tipo de Arquivo</Label>
              <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOC">DOC</SelectItem>
                  <SelectItem value="XLS">XLS</SelectItem>
                  <SelectItem value="PPT">PPT</SelectItem>
                  <SelectItem value="IMG">Imagem</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="dateFrom">Data De</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="dateTo">Data Até</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {filteredMaterials.length} de {materials.length} materiais
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardContent className="p-0">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {materials.length === 0 ? "Nenhum material encontrado" : "Nenhum material corresponde aos filtros"}
              </h3>
              <p className="text-gray-500">
                {materials.length === 0 
                  ? "Quando materiais forem anexados às mentorias, eles aparecerão aqui."
                  : "Tente ajustar os filtros para encontrar os materiais desejados."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arquivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sessão/Encontro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enviado por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Upload
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {material.nome_arquivo}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getFileTypeBadge(material.tipo_mime_arquivo)}
                              <span className="text-xs text-gray-500">
                                {formatFileSize(material.tamanho_arquivo_bytes)}
                              </span>
                            </div>
                            {material.descricao_material && (
                              <div className="text-xs text-gray-600 mt-1">
                                {material.descricao_material}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{material.mentoria_nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{material.sessao_titulo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {material.aluno_nome || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{material.uploader_nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(material.data_upload), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadMaterial(material)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentoringMaterials;
