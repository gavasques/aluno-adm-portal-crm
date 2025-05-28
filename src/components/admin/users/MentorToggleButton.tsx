
import React, { useState } from "react";
import { useMentors } from "@/hooks/useMentors";
import { GraduationCap } from "lucide-react";
import { DesignLoadingButton } from "@/design-system/components/DesignLoadingButton";
import { useUXFeedback } from "@/hooks/useUXFeedback";

interface MentorToggleButtonProps {
  userId: string;
  userEmail: string;
  userName: string;
  isMentor: boolean;
  onUpdate?: () => void;
}

const MentorToggleButton: React.FC<MentorToggleButtonProps> = ({
  userId,
  userEmail,
  userName,
  isMentor,
  onUpdate
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateMentorStatus } = useMentors();
  const { handleAsyncAction } = useUXFeedback();

  const handleToggleMentor = async () => {
    await handleAsyncAction(
      async () => {
        setIsUpdating(true);
        console.log(`Alterando status de mentor para ${userName} (${userEmail}):`, {
          userId,
          fromStatus: isMentor,
          toStatus: !isMentor
        });
        
        const success = await updateMentorStatus(userId, !isMentor);
        
        if (success) {
          // Chamar callback para atualizar a lista
          if (onUpdate) {
            setTimeout(onUpdate, 500);
          }
          return true;
        }
        throw new Error('Falha ao alterar status');
      },
      {
        successMessage: `🎓 ${userName} ${!isMentor ? 'agora é mentor' : 'não é mais mentor'}`,
        errorMessage: "❌ Erro ao alterar status de mentor",
        loadingMessage: `⚙️ ${!isMentor ? 'Tornando mentor' : 'Removendo status'}...`
      }
    );
    setIsUpdating(false);
  };

  return (
    <DesignLoadingButton
      variant={isMentor ? "primary" : "outline"}
      size="sm"
      loading={isUpdating}
      loadingText={!isMentor ? "Tornando Mentor..." : "Removendo..."}
      onClick={handleToggleMentor}
      className={isMentor ? "bg-blue-600 hover:bg-blue-700" : ""}
    >
      <GraduationCap className="h-3 w-3 mr-1" />
      {isMentor ? "É Mentor" : "Tornar Mentor"}
    </DesignLoadingButton>
  );
};

export default MentorToggleButton;
