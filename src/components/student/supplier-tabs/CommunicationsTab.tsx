
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowRight, Trash, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Communication {
  id: number;
  date: string;
  type: string;
  notes: string;
  contact: string;
  observacoes?: string;
}

interface CommunicationsTabProps {
  communications: Communication[];
  onUpdate: (communications: Communication[]) => void;
  isEditing?: boolean;
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({ 
  communications = [], 
  onUpdate,
  isEditing = true
}) => {
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [isDetailsPage, setIsDetailsPage] = useState<boolean>(false);

  const [newCommunication, setNewCommunication] = useState<Communication>({
    id: Date.now(),
    date: format(new Date(), "yyyy-MM-dd"),
    type: "Reunião",
    notes: "",
    contact: "",
    observacoes: ""
  });

  const resetNewCommunication = () => {
    setNewCommunication({
      id: Date.now(),
      date: format(new Date(), "yyyy-MM-dd"),
      type: "Reunião",
      notes: "",
      contact: "",
      observacoes: ""
    });
  };

  const handleAddCommunication = () => {
    if (!newCommunication.type || !newCommunication.notes) {
      toast.error("Tipo e anotações são campos obrigatórios!");
      return;
    }

    onUpdate([...communications, { ...newCommunication, id: Date.now() }]);
    toast.success("Comunicação adicionada com sucesso!");
    resetNewCommunication();
    setIsDetailsPage(false);
  };

  const handleEditCommunication = () => {
    if (!selectedCommunication || !selectedCommunication.type || !selectedCommunication.notes) {
      toast.error("Tipo e anotações são campos obrigatórios!");
      return;
    }

    onUpdate(communications.map(comm => 
      comm.id === selectedCommunication.id ? selectedCommunication : comm
    ));
    toast.success("Comunicação atualizada com sucesso!");
    setSelectedCommunication(null);
    setIsDetailsPage(false);
  };

  const handleDeleteCommunication = (id: number) => {
    onUpdate(communications.filter(comm => comm.id !== id));
  };
  
  const viewCommunication = (communication: Communication) => {
    setSelectedCommunication({ ...communication });
    setIsDetailsPage(true);
  };

  const addNewCommunication = () => {
    resetNewCommunication();
    setSelectedCommunication(null);
    setIsDetailsPage(true);
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch(e) {
      return dateString;
    }
  };

  return (
    <>
      {!isDetailsPage ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Comunicações</CardTitle>
            {isEditing && (
              <Button onClick={addNewCommunication}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Comunicação
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {communications.length > 0 ? (
              <div className="space-y-4">
                {communications.map((communication) => (
                  <div key={communication.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-portal-light text-portal-primary p-2 rounded-full">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">{formatDisplayDate(communication.date)}</div>
                          <div className="text-xs text-gray-500">{communication.type}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => viewCommunication(communication)}
                        >
                          Ver <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                        
                        {isEditing && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir comunicação</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta comunicação? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCommunication(communication.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-10">
                      <div className="text-sm">{communication.notes}</div>
                      {communication.contact && (
                        <div className="text-sm text-gray-500 mt-1">Contato: {communication.contact}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhuma comunicação registrada.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="mr-2"
                onClick={() => setIsDetailsPage(false)}
              >
                <ArrowRight className="h-4 w-4 transform rotate-180" />
              </Button>
              <CardTitle>{selectedCommunication ? 'Detalhes da Comunicação' : 'Nova Comunicação'}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={!isEditing}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedCommunication
                          ? formatDisplayDate(selectedCommunication.date)
                          : formatDisplayDate(newCommunication.date)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedCommunication 
                          ? new Date(selectedCommunication.date) 
                          : new Date(newCommunication.date)}
                        onSelect={(date) => {
                          if (date) {
                            const formattedDate = format(date, "yyyy-MM-dd");
                            if (selectedCommunication) {
                              setSelectedCommunication({
                                ...selectedCommunication,
                                date: formattedDate
                              });
                            } else {
                              setNewCommunication({
                                ...newCommunication,
                                date: formattedDate
                              });
                            }
                          }
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedCommunication ? selectedCommunication.type : newCommunication.type}
                    onChange={(e) => {
                      if (selectedCommunication) {
                        setSelectedCommunication({
                          ...selectedCommunication,
                          type: e.target.value
                        });
                      } else {
                        setNewCommunication({
                          ...newCommunication,
                          type: e.target.value
                        });
                      }
                    }}
                    disabled={!isEditing}
                  >
                    <option value="Reunião">Reunião</option>
                    <option value="Ligação">Ligação</option>
                    <option value="Email">Email</option>
                    <option value="Visita">Visita</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Contato</label>
                <Input 
                  value={selectedCommunication ? selectedCommunication.contact : newCommunication.contact} 
                  onChange={(e) => {
                    if (selectedCommunication) {
                      setSelectedCommunication({
                        ...selectedCommunication,
                        contact: e.target.value
                      });
                    } else {
                      setNewCommunication({
                        ...newCommunication,
                        contact: e.target.value
                      });
                    }
                  }}
                  placeholder="Nome do contato" 
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Anotações</label>
                <Textarea 
                  value={selectedCommunication ? selectedCommunication.notes : newCommunication.notes} 
                  onChange={(e) => {
                    if (selectedCommunication) {
                      setSelectedCommunication({
                        ...selectedCommunication,
                        notes: e.target.value
                      });
                    } else {
                      setNewCommunication({
                        ...newCommunication,
                        notes: e.target.value
                      });
                    }
                  }}
                  placeholder="Detalhes da comunicação" 
                  rows={3}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Observações</label>
                <Textarea 
                  value={(selectedCommunication ? selectedCommunication.observacoes : newCommunication.observacoes) || ''} 
                  onChange={(e) => {
                    if (selectedCommunication) {
                      setSelectedCommunication({
                        ...selectedCommunication,
                        observacoes: e.target.value
                      });
                    } else {
                      setNewCommunication({
                        ...newCommunication,
                        observacoes: e.target.value
                      });
                    }
                  }}
                  placeholder="Observações adicionais" 
                  rows={3}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsPage(false)}
              >
                Cancelar
              </Button>
              
              {isEditing && (
                <Button 
                  onClick={selectedCommunication ? handleEditCommunication : handleAddCommunication}
                >
                  {selectedCommunication ? 'Salvar Alterações' : 'Adicionar'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CommunicationsTab;
