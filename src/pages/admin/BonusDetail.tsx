
import React from "react";
import { useParams } from "react-router-dom";
import { FileText, MessageSquare, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BonusDetailHeader from "@/components/admin/bonus/BonusDetailHeader";
import BonusDataTab from "@/components/admin/bonus/BonusDataTab";
import BonusCommentsTab from "@/components/admin/bonus/BonusCommentsTab";
import BonusFilesTab from "@/components/admin/bonus/BonusFilesTab";
import { useBonusDetail } from "@/hooks/admin/useBonusDetail";
import { useBonusComments } from "@/hooks/admin/useBonusComments";
import { useBonusFiles } from "@/hooks/admin/useBonusFiles";

const BonusDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    isLoading,
    bonus,
    isEditing,
    formData,
    setIsEditing,
    handleFormChange,
    handleSave,
    handleDelete,
    handleCancel,
    navigate
  } = useBonusDetail(id);

  const {
    comments,
    newComment,
    setNewComment,
    addComment,
    handleLikeComment,
    deleteComment
  } = useBonusComments(id);

  const {
    files,
    newFileDescription,
    setNewFileDescription,
    handleFileUpload,
    deleteFile
  } = useBonusFiles(id);

  if (isLoading) {
    return (
      <div className="px-6 py-6 w-full">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bonus) {
    return (
      <div className="px-6 py-6 w-full">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Bônus não encontrado</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 w-full">
      <Card>
        <BonusDetailHeader
          bonusId={bonus.bonus_id}
          isEditing={isEditing}
          onBack={() => navigate("/admin/bonus")}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
        
        <CardContent>
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dados" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" /> Dados
              </TabsTrigger>
              <TabsTrigger value="comentarios" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" /> Comentários
              </TabsTrigger>
              <TabsTrigger value="arquivos" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" /> Arquivos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados" className="mt-0">
              <BonusDataTab
                bonus={bonus}
                isEditing={isEditing}
                formData={formData}
                onChange={handleFormChange}
              />
            </TabsContent>
            
            <TabsContent value="comentarios" className="mt-0">
              <BonusCommentsTab
                comments={comments}
                newComment={newComment}
                onNewCommentChange={setNewComment}
                onAddComment={addComment}
                onLikeComment={handleLikeComment}
                onDeleteComment={deleteComment}
              />
            </TabsContent>
            
            <TabsContent value="arquivos" className="mt-0">
              <BonusFilesTab
                files={files}
                newFileDescription={newFileDescription}
                onNewFileDescriptionChange={setNewFileDescription}
                onFileUpload={handleFileUpload}
                onDeleteFile={deleteFile}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusDetail;
