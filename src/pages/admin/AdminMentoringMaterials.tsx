
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit,
  Trash2,
  FolderOpen,
  Users,
  HardDrive
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MaterialUploadForm from '@/components/admin/mentoring/MaterialUploadForm';

const AdminMentoringMaterials = () => {
  const { materials } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [uploaderFilter, setUploaderFilter] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes('pdf')) return 'bg-red-100 text-red-800 border-red-200';
    if (fileType.includes('word')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'bg-green-100 text-green-800 border-green-200';
    if (fileType.includes('image')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = !searchTerm || 
      material.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFileType = !fileTypeFilter || material.fileType.includes(fileTypeFilter);
    const matchesUploader = !uploaderFilter || material.uploaderType === uploaderFilter;
    
    return matchesSearch && matchesFileType && matchesUploader;
  });

  const handleUploadMaterial = (data: any) => {
    console.log('Uploading material:', data);
    setShowUploadForm(false);
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este material?')) {
      console.log('Deleting material:', id);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for:`, selectedMaterials);
  };

  const toggleSelection = (id: string) => {
    setSelectedMaterials(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedMaterials(
      selectedMaterials.length === filteredMaterials.length 
        ? [] 
        : filteredMaterials.map(m => m.id)
    );
  };

  const handleDownloadAll = () => {
    console.log('Downloading selected materials:', selectedMaterials);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Central de Materiais</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os materiais das mentorias</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderOpen className="h-4 w-4 mr-2" />
            Organizar
          </Button>
          <Button onClick={() => setShowUploadForm(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Material
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Materiais</p>
                <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tamanho Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {materials.reduce((acc, m) => acc + m.sizeMB, 0).toFixed(1)} MB
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <HardDrive className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uploads de Mentores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {materials.filter(m => m.uploaderType === 'mentor').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uploads de Alunos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {materials.filter(m => m.uploaderType === 'aluno').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome do arquivo, descrição..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de Arquivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="word">Word</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="image">Imagem</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={uploaderFilter} onValueChange={setUploaderFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Uploader" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="aluno">Aluno</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMaterials.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedMaterials.length} material(is) selecionado(s)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Selecionados
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('move')}>
                  Mover
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                  Excluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Materiais ({filteredMaterials.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0}
                      onChange={selectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Arquivo</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Tamanho</th>
                  <th className="text-left py-3 px-4 font-medium">Uploader</th>
                  <th className="text-left py-3 px-4 font-medium">Data</th>
                  <th className="text-left py-3 px-4 font-medium">Tags</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => toggleSelection(material.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{material.fileName}</div>
                          <div className="text-sm text-gray-500">{material.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getFileTypeColor(material.fileType)}>
                        {getFileExtension(material.fileName)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {material.sizeMB.toFixed(1)} MB
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {material.uploaderType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {format(new Date(material.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {material.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {material.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{material.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Excluir"
                          onClick={() => handleDeleteMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form Dialog */}
      <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload de Material</DialogTitle>
          </DialogHeader>
          <MaterialUploadForm
            onSubmit={handleUploadMaterial}
            onCancel={() => setShowUploadForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMentoringMaterials;
