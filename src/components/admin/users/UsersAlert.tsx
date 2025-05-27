
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UsersAlertProps {
  fetchError: string | null;
}

export const UsersAlert: React.FC<UsersAlertProps> = ({ fetchError }) => {
  if (!fetchError) return null;
  
  return (
    <Alert variant="warning" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Atenção</AlertTitle>
      <AlertDescription>{fetchError}</AlertDescription>
    </Alert>
  );
};

export default UsersAlert;
