
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { usePermissionGroupRecovery } from "@/hooks/admin/permissions/usePermissionGroupRecovery";

interface PermissionGroupRecoveryButtonProps {
  onSuccess: () => void;
}

const PermissionGroupRecoveryButton: React.FC<PermissionGroupRecoveryButtonProps> = ({
  onSuccess,
}) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const { recoverMentorGroupMenus } = usePermissionGroupRecovery();

  const handleRecovery = async () => {
    try {
      setIsRecovering(true);
      const success = await recoverMentorGroupMenus();
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro na recuperação:", error);
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <Button
      onClick={handleRecovery}
      disabled={isRecovering}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
    >
      {isRecovering ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      {isRecovering ? "Recuperando..." : "Recuperar Grupo Mentor"}
    </Button>
  );
};

export default PermissionGroupRecoveryButton;
