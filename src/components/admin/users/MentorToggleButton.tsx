
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMentors } from "@/hooks/useMentors";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  const handleToggleMentor = async () => {
    setIsUpdating(true);
    
    try {
      console.log(`Alterando status de mentor para ${userName} (${userEmail}):`, {
        userId,
        fromStatus: isMentor,
        toStatus: !isMentor
      });
      
      const success = await updateMentorStatus(userId, !isMentor);
      
      if (success) {
        toast({
          title: "✅ Status Atualizado",
          description: `${userName} ${!isMentor ? 'agora é mentor' : 'não é mais mentor'}`,
          duration: 3000,
        });
        
        // Chamar callback para atualizar a lista
        if (onUpdate) {
          setTimeout(onUpdate, 500);
        }
      }
    } catch (error) {
      console.error('Erro ao alterar status de mentor:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status de mentor",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant={isMentor ? "default" : "outline"}
      size="sm"
      onClick={handleToggleMentor}
      disabled={isUpdating}
      className={isMentor ? "bg-blue-600 hover:bg-blue-700" : ""}
    >
      {isUpdating ? (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      ) : (
        <GraduationCap className="h-3 w-3 mr-1" />
      )}
      {isUpdating ? "Atualizando..." : (isMentor ? "É Mentor" : "Tornar Mentor")}
    </Button>
  );
};

export default MentorToggleButton;
