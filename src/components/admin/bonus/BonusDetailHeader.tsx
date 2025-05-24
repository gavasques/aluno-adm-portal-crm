
import React from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BonusDetailHeaderProps {
  bonusId: string;
  isEditing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const BonusDetailHeader: React.FC<BonusDetailHeaderProps> = ({
  bonusId,
  isEditing,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-3xl font-bold">Detalhes do Bônus</h1>
      </div>

      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">{bonusId}</CardTitle>
            <CardDescription>
              Visualize e edite os detalhes do bônus
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={onSave}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" /> Salvar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onEdit}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" /> Excluir
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </>
  );
};

export default BonusDetailHeader;
