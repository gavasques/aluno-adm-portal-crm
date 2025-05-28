
import React from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DesignLoadingButton } from "@/design-system/components/DesignLoadingButton";
import { DesignButton } from "@/design-system/components/DesignButton";

interface BonusDetailHeaderProps {
  bonusId: string;
  isEditing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const BonusDetailHeader: React.FC<BonusDetailHeaderProps> = ({
  bonusId,
  isEditing,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isLoading = false
}) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <DesignButton 
          variant="ghost" 
          onClick={onBack} 
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </DesignButton>
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
                <DesignButton
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </DesignButton>
                <DesignLoadingButton
                  onClick={onSave}
                  loading={isLoading}
                  loadingText="Salvando..."
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" /> Salvar
                </DesignLoadingButton>
              </>
            ) : (
              <>
                <DesignButton
                  variant="outline"
                  onClick={onEdit}
                  disabled={isLoading}
                >
                  Editar
                </DesignButton>
                <DesignLoadingButton
                  variant="destructive"
                  onClick={onDelete}
                  loading={isLoading}
                  loadingText="Excluindo..."
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" /> Excluir
                </DesignLoadingButton>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </>
  );
};

export default BonusDetailHeader;
