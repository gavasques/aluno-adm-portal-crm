
import React from "react";
import { Shield, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SecurityIndicatorProps {
  isRateLimited: boolean;
  remainingTime: number;
  remainingAttempts: number;
  className?: string;
}

export const SecurityIndicator: React.FC<SecurityIndicatorProps> = ({
  isRateLimited,
  remainingTime,
  remainingAttempts,
  className = ""
}) => {
  if (isRateLimited) {
    const minutes = Math.ceil(remainingTime / 60);
    
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">
                Conta temporariamente bloqueada
              </p>
              <p className="text-xs text-red-600">
                Aguarde {minutes} minuto{minutes !== 1 ? 's' : ''} para tentar novamente
              </p>
            </div>
            <Badge variant="destructive" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {minutes}min
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (remainingAttempts <= 2 && remainingAttempts > 0) {
    return (
      <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-700">
                Atenção - Segurança
              </p>
              <p className="text-xs text-yellow-600">
                Restam {remainingAttempts} tentativa{remainingAttempts !== 1 ? 's' : ''} antes do bloqueio temporário
              </p>
            </div>
            <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
              {remainingAttempts}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
