
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, IdCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Tipos para a mentoria
interface Mentoring {
  id: string;
  mentoringId: string; // Campo ID único
  name: string;
  duration: string;
  type: string;
  registrationDate: string;
  periodicity: string;
}

const Mentoring = () => {
  const navigate = useNavigate();
  const [mentorings, setMentorings] = useState<Mentoring[]>([
    {
      id: "1",
      mentoringId: "MNT001",
      name: "Mentoria de E-commerce",
      duration: "3 meses",
      type: "Individual",
      registrationDate: "01/05/2025",
      periodicity: "Semanal"
    },
    {
      id: "2",
      mentoringId: "MNT002",
      name: "Mentoria de Marketing Digital",
      duration: "6 meses",
      type: "Grupo",
      registrationDate: "15/04/2025",
      periodicity: "Quinzenal"
    }
  ]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mentoringToDelete, setMentoringToDelete] = useState<string | null>(null);

  // Função para gerar IDs únicos para mentorias
  const generateMentoringId = () => {
    const prefix = "MNT";
    const existingIds = mentorings.map(mentoring => mentoring.mentoringId);
    let counter = existingIds.length + 1;
    let newId;
    
    do {
      newId = `${prefix}${counter.toString().padStart(3, '0')}`;
      counter++;
    } while (existingIds.includes(newId));
    
    return newId;
  };

  const handleAddMentoring = () => {
    navigate("/admin/mentoring/new");
  };

  const handleViewMentoring = (id: string) => {
    navigate(`/admin/mentoring/${id}`);
  };

  const confirmDelete = (id: string) => {
    setMentoringToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteMentoring = () => {
    if (mentoringToDelete) {
      setMentorings(prev => prev.filter(mentoring => mentoring.id !== mentoringToDelete));
      toast.success("Mentoria removida com sucesso");
      setDeleteDialogOpen(false);
      setMentoringToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-portal-dark">Cadastro de Mentorias</h1>
        <Button onClick={handleAddMentoring} className="bg-portal-primary hover:bg-portal-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Mentoria
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Mentorias Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {mentorings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><div className="flex items-center"><IdCard className="mr-1 h-4 w-4" /> ID</div></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Periodicidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentorings.map((mentoring) => (
                  <TableRow key={mentoring.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell onClick={() => handleViewMentoring(mentoring.id)}>{mentoring.mentoringId}</TableCell>
                    <TableCell onClick={() => handleViewMentoring(mentoring.id)}>{mentoring.name}</TableCell>
                    <TableCell onClick={() => handleViewMentoring(mentoring.id)}>{mentoring.duration}</TableCell>
                    <TableCell onClick={() => handleViewMentoring(mentoring.id)}>{mentoring.type}</TableCell>
                    <TableCell onClick={() => handleViewMentoring(mentoring.id)}>{mentoring.periodicity}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(mentoring.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma mentoria cadastrada.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover mentoria</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover esta mentoria? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteMentoring}>Remover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mentoring;
