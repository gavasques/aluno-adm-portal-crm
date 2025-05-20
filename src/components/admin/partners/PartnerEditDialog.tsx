
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Partner } from "@/hooks/usePartnersState";

interface PartnerEditDialogProps {
  partner: Partner | null;
  onCancel: () => void;
  onSave: () => void;
  onPartnerChange: (updatedPartner: Partner) => void;
}

const PartnerEditDialog = ({
  partner,
  onCancel,
  onSave,
  onPartnerChange
}: PartnerEditDialogProps) => {
  if (!partner) return null;

  const handleChange = (field: keyof Partner, value: any) => {
    onPartnerChange({
      ...partner,
      [field]: value
    });
  };

  return (
    <Dialog open={!!partner} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Parceiro</DialogTitle>
          <DialogDescription>
            Atualize as informações do parceiro. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <Input 
                value={partner.name} 
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <Input 
                value={partner.category} 
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <Select 
                value={partner.type} 
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agência">Agência</SelectItem>
                  <SelectItem value="Consultor">Consultor</SelectItem>
                  <SelectItem value="Serviço">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contato Principal</label>
              <Input 
                value={partner.contact} 
                onChange={(e) => handleChange("contact", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input 
                value={partner.email} 
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <Input 
                value={partner.phone} 
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <Input 
                value={partner.website} 
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recomendado</label>
              <div className="flex items-center mt-2">
                <input 
                  type="checkbox"
                  checked={partner.recommended}
                  onChange={(e) => handleChange("recommended", e.target.checked)}
                  className="mr-2"
                />
                <span>Marcar como recomendado</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <Input 
                value={partner.address} 
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                value={partner.description} 
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onSave}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerEditDialog;
