import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  MessageSquare, 
  Upload,
  Download,
  ExternalLink,
  Edit,
  Save,
  X
} from 'lucide-react';
import { MentoringSession } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaterialUploadDialog } from '../MaterialUploadDialog';

interface SessionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: MentoringSession | null;
}

export const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({
  open,
  onOpenChange,
  session
}) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [mentorNotes, setMentorNotes] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showMaterialUpload, setShowMaterialUpload] = useState(false);

  // Mock comments data
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Ana Silva (Mentor)',
      content: 'Sessão muito produtiva! O aluno demonstrou grande evolução.',
      timestamp: '2025-01-30T15:30:00Z',
      isFile: false
    },
    {
      id: '2', 
      author: 'Bianca Mentora (Aluno)',
      content: 'Obrigada pelas dicas! Já consegui implementar algumas sugestões.',
      timestamp: '2025-01-30T16:00:00Z',
      isFile: false
    }
  ]);

  // Mock materials data
  const [materials, setMaterials] = useState([
    {
      id: '1',
      fileName: 'Plano_Estratégico_Template.pdf',
      fileSize: '2.4 MB',
      uploadedBy: 'Ana Silva',
      uploadedAt: '2025-01-30T14:00:00Z',
      type: 'pdf'
    },
    {
      id: '2',
      fileName: 'Gravação_Sessão_1.mp4',
      fileSize: '124.5 MB', 
      uploadedBy: 'Sistema',
      uploadedAt: '2025-01-30T15:00:00Z',
      type: 'video'
    }
  ]);

  if (!session) return null;

  React.useEffect(() => {
    if (session) {
      setMentorNotes(session.mentorNotes || '');
      setStudentNotes(session.studentNotes || '');
    }
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no_show_aluno': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'no_show_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento': return 'Aguardando Agendamento';
      case 'agendada': return 'Agendada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      case 'reagendada': return 'Reagendada';
      case 'no_show_aluno': return 'Faltou Aluno';
      case 'no_show_mentor': return 'Faltou Mentor';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const handleSaveNotes = () => {
    console.log('Salvando notas:', { mentorNotes, studentNotes });
    setEditingNotes(false);
    // Aqui você faria a chamada para salvar as notas no backend
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      author: 'Ana Silva (Mentor)', // Em uma implementação real, seria o usuário atual
      content: newComment,
      timestamp: new Date().toISOString(),
      isFile: false
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {session.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informações da Sessão</span>
                <Badge className={`${getStatusColor(session.status)} text-sm`}>
                  {getStatusLabel(session.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Data e Hora</p>
                    <p className="font-medium">
                      {session.scheduledDate ? formatDate(session.scheduledDate) : 'Não agendada'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Duração</p>
                    <p className="font-medium">{session.durationMinutes} minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Sessão</p>
                    <p className="font-medium">#{session.sessionNumber}</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              {(session.meetingLink || session.recordingLink) && (
                <div className="mt-4 space-y-2">
                  {session.meetingLink && (
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-500" />
                      <a 
                        href={session.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Link da reunião <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {session.recordingLink && (
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-green-500" />
                      <a 
                        href={session.recordingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline flex items-center gap-1"
                      >
                        Gravação da sessão <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Abas principais */}
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notes">Notas</TabsTrigger>
              <TabsTrigger value="comments">Comentários ({comments.length})</TabsTrigger>
              <TabsTrigger value="materials">Materiais ({materials.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Notas da Sessão</h3>
                {!editingNotes ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingNotes(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingNotes(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSaveNotes}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notas do Mentor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingNotes ? (
                      <Textarea
                        value={mentorNotes}
                        onChange={(e) => setMentorNotes(e.target.value)}
                        placeholder="Adicione suas notas sobre a sessão..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {mentorNotes || 'Nenhuma nota do mentor.'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notas do Aluno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingNotes ? (
                      <Textarea
                        value={studentNotes}
                        onChange={(e) => setStudentNotes(e.target.value)}
                        placeholder="Notas do aluno sobre a sessão..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {studentNotes || 'Nenhuma nota do aluno.'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comentários da Sessão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista de comentários */}
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  ))}

                  {/* Adicionar novo comentário */}
                  <div className="border-t border-gray-200 pt-4">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Adicione um comentário..."
                      className="mb-3"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setNewComment('')}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comentar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Materiais da Sessão</span>
                    <Button size="sm" onClick={() => setShowMaterialUpload(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {materials.length > 0 ? (
                    <div className="space-y-3">
                      {materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getFileIcon(material.type)}</span>
                            <div>
                              <p className="font-medium">{material.fileName}</p>
                              <p className="text-sm text-gray-500">
                                {material.fileSize} • Enviado por {material.uploadedBy} • {formatDate(material.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum material disponível
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Faça upload de materiais relacionados a esta sessão.
                      </p>
                      <Button onClick={() => setShowMaterialUpload(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar primeiro material
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Material Upload Dialog */}
        <MaterialUploadDialog
          open={showMaterialUpload}
          onOpenChange={setShowMaterialUpload}
          sessionId={session.id}
          enrollmentId={session.enrollmentId}
          onUploadSuccess={() => {
            console.log('Material uploaded for session');
            // Aqui você atualizaria a lista de materiais da sessão
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailDialog;
