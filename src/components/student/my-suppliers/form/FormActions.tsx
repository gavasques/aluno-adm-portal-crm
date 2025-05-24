
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export const FormActions = ({ onCancel, isSubmitting }: FormActionsProps) => {
  return (
    <DialogFooter className="mt-6">
      <Button 
        variant="outline" 
        type="button"
        onClick={onCancel}
        className="mr-2 border-gray-200 hover:bg-gray-100"
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
      >
        {isSubmitting ? "Adicionando..." : "Adicionar Fornecedor"}
      </Button>
    </DialogFooter>
  );
};
