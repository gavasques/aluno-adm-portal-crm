
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Trash2, 
  Upload,
  Eye,
  FolderOpen
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import MaterialUploadForm from '@/components/admin/mentoring/MaterialUploadForm';
import { format } from 'date-fns';

const AdminMentoringMaterials = () => {
  const { materials } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [uploaderFilter, setUploaderFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Central de Materiais' }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = !searchTerm || 
      material.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !typeFilter || material.fileType.includes(typeFilter);
    const matchesUploader = !uploaderFilter || material.uploaderType === uploaderFilter;
    
    return matchesSearch && matchesType && matchesUploader;
  });

  const handleUploadMaterial = (data: any) => {
    console.log('Uploading material:', data);
    setShowForm(false);
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este material?')) {
      console.log('Deleting material:', id);
    }
  };

  const handleBulkDownload = () => {
    console.log('Bulk downloading materials:', selectedMaterials);
  };

  const toggleSelection = (id: string) => {
    setSelectedMaterials(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📽️';
    return '📎';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Central de Materiais</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os materiais das mentorias</p>
        </div>
        <div className="flex gap-2">
          {selectedMaterials.length > 0 && (
            <Button variant="outline" onClick={handleBulkDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download ({selectedMaterials.length})
            </Button>
          )}
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Material
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
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Por Mentores</p>
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
                <p className="text-sm font-medium text-gray-600">Por Alunos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {materials.filter(m => m.uploaderType === 'aluno').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Upload className="h-6 w-6 text-orange-600" />
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
                placeholder="Buscar por nome do arquivo ou descrição..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de Arquivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="image">Imagens</SelectItem>
                <SelectItem value="video">Vídeos</SelectItem>
                <SelectItem value="spreadsheet">Planilhas</SelectItem>
                <SelectItem value="presentation">Apresentações</SelectItem>
              </SelectContent>
            </Select>
            <Select value={uploaderFilter} onValueChange={setUploaderFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Enviado por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="aluno">Aluno</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getFileTypeIcon(material.fileType)}</span>
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material.id)}
                    onChange={() => toggleSelection(material.id)}
                  />
                </div>
                <Badge variant="outline" className="capitalize">
                  {material.uploaderType}
                </Badge>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                {material.fileName}
              </h3>
              
              {material.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {material.description}
                </p>
              )}
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{material.sizeMB} MB</span>
                  <span>{format(new Date(material.createdAt), 'dd/MM/yyyy')}</span>
                </div>
                
                {material.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {material.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {material.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{material.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteMaterial(material.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum material encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || typeFilter || uploaderFilter 
                ? 'Tente ajustar os filtros para encontrar materiais.'
                : 'Nenhum material foi enviado ainda.'
              }
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Material
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Material</DialogTitle>
          </DialogHeader>
          <MaterialUploadForm
            onSubmit={handleUploadMaterial}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMentoringMaterials;
