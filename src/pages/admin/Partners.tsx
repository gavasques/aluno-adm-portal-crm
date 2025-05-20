import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

// Importando os novos hooks após a refatoração
import { usePartnersList } from "@/hooks/partners/usePartnersList";
import { usePartnerDetail } from "@/hooks/partners/usePartnerDetail";
import { usePartnerEdit } from "@/hooks/partners/usePartnerEdit";
import { usePartnerContacts } from "@/hooks/partners/usePartnerContacts";
import { usePartnerComments } from "@/hooks/partners/usePartnerComments";
import { usePartnerRatings } from "@/hooks/partners/usePartnerRatings";

// Import components
import PartnersTable from "@/components/admin/partners/PartnersTable";
import PartnerDetailDialog from "@/components/admin/partners/PartnerDetailDialog";
import PartnerEditDialog from "@/components/admin/partners/PartnerEditDialog";

const Partners = () => {
  // Usando os hooks individuais após a refatoração
  const {
    partners,
    filteredPartners,
    searchQuery,
    setSearchQuery,
    partnerTypeFilter,
    setPartnerTypeFilter,
    recommendedFilter,
    setRecommendedFilter,
    handleDeletePartner,
    toggleRecommendedStatus,
    updatePartner
  } = usePartnersList();
  
  const {
    selectedPartner,
    setSelectedPartner,
    handleOpenPartner,
    handleClosePartner,
    calculateAverageRating
  } = usePartnerDetail();
  
  const {
    editingPartner,
    setEditingPartner,
    handleEditPartner,
    handleSavePartner
  } = usePartnerEdit(updatePartner);
  
  const {
    newContactName,
    newContactRole,
    newContactEmail,
    newContactPhone,
    setNewContactName,
    setNewContactRole,
    setNewContactEmail,
    setNewContactPhone,
    handleAddContact,
    handleDeleteContact
  } = usePartnerContacts(selectedPartner, setSelectedPartner, updatePartner);
  
  const {
    commentText,
    setCommentText,
    handleAddComment,
    handleLikeComment,
    handleDeleteComment
  } = usePartnerComments(selectedPartner, setSelectedPartner, updatePartner);
  
  const {
    ratingValue,
    ratingText,
    setRatingValue,
    setRatingText,
    handleAddRating,
    handleLikeRating,
    handleDeleteRating
  } = usePartnerRatings(selectedPartner, setSelectedPartner, updatePartner);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Parceiros</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Parceiro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Parceiro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Formulário seria implementado aqui */}
              <p>Formulário para adicionar um novo parceiro.</p>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={partnerTypeFilter} onValueChange={setPartnerTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtro: Tipo de Parceiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="Agência">Agência</SelectItem>
              <SelectItem value="Consultor">Consultor</SelectItem>
              <SelectItem value="Serviço">Serviço</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={recommendedFilter} onValueChange={setRecommendedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtro: Recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Recomendações</SelectItem>
              <SelectItem value="recommended">Recomendados</SelectItem>
              <SelectItem value="not-recommended">Não Recomendados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
          <CardDescription>
            Gerencie os parceiros disponíveis no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartnersTable 
            partners={filteredPartners}
            calculateAverageRating={calculateAverageRating}
            handleOpenPartner={handleOpenPartner}
            handleEditPartner={handleEditPartner}
            toggleRecommendedStatus={toggleRecommendedStatus}
            handleDeletePartner={handleDeletePartner}
          />
        </CardContent>
      </Card>
      
      {/* Partner Edit Dialog */}
      <PartnerEditDialog 
        partner={editingPartner}
        onCancel={() => handleEditPartner(null)}
        onSave={handleSavePartner}
        onPartnerChange={setEditingPartner}
      />
      
      {/* Partner Detail Dialog */}
      <PartnerDetailDialog 
        partner={selectedPartner}
        onClose={handleClosePartner}
        onEdit={handleEditPartner}
        newContactName={newContactName}
        newContactRole={newContactRole}
        newContactEmail={newContactEmail}
        newContactPhone={newContactPhone}
        setNewContactName={setNewContactName}
        setNewContactRole={setNewContactRole}
        setNewContactEmail={setNewContactEmail}
        setNewContactPhone={setNewContactPhone}
        handleAddContact={handleAddContact}
        handleDeleteContact={handleDeleteContact}
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
        handleLikeComment={handleLikeComment}
        handleDeleteComment={handleDeleteComment}
        calculateAverageRating={calculateAverageRating}
        ratingValue={ratingValue}
        ratingText={ratingText}
        setRatingValue={setRatingValue}
        setRatingText={setRatingText}
        handleAddRating={handleAddRating}
        handleLikeRating={handleLikeRating}
        handleDeleteRating={handleDeleteRating}
      />
    </div>
  );
};

export default Partners;
