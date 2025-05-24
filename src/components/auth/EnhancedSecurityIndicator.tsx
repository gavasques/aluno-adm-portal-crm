
import React from "react";
import { Shield, Clock, AlertTriangle, Activity, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface EnhancedSecurityIndicatorProps {
  isRateLimited: boolean;
  remainingTime: number;
  remainingAttempts: number;
  riskLevel: 'low' | 'medium' | 'high';
  className?: string;
}

export const EnhancedSecurityIndicator: React.FC<EnhancedSecurityIndicatorProps> = ({
  isRateLimited,
  remainingTime,
  remainingAttempts,
  riskLevel,
  className = ""
}) => {
  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return Eye;
      default: return Shield;
    }
  };

  const getRiskMessage = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'Alto risco - Atividade suspeita detectada';
      case 'medium': return 'Risco moderado - Monitorando tentativas';
      default: return 'Baixo risco - Conexão segura';
    }
  };

  if (isRateLimited) {
    const minutes = Math.ceil(remainingTime / 60);
    const Icon = getRiskIcon(riskLevel);
    
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">
                Acesso temporariamente bloqueado
              </p>
              <p className="text-xs text-red-600">
                {riskLevel === 'high' && "Atividade suspeita detectada. "}
                Aguarde {minutes} minuto{minutes !== 1 ? 's' : ''} para tentar novamente
              </p>
              <div className="mt-2">
                <Progress 
                  value={(remainingTime / 1800) * 100} 
                  className="h-1"
                />
              </div>
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
    const Icon = getRiskIcon(riskLevel);
    const colorClass = getRiskColor(riskLevel);
    
    return (
      <Card className={`${colorClass} ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${riskLevel === 'high' ? 'text-red-500' : riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${riskLevel === 'high' ? 'text-red-700' : riskLevel === 'medium' ? 'text-yellow-700' : 'text-green-700'}`}>
                {getRiskMessage(riskLevel)}
              </p>
              <p className={`text-xs ${riskLevel === 'high' ? 'text-red-600' : riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                Restam {remainingAttempts} tentativa{remainingAttempts !== 1 ? 's' : ''} antes do bloqueio temporário
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${riskLevel === 'high' ? 'border-red-300 text-red-700' : riskLevel === 'medium' ? 'border-yellow-300 text-yellow-700' : 'border-green-300 text-green-700'}`}>
                <Activity className="h-3 w-3 mr-1" />
                {remainingAttempts}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Indicador discreto para baixo risco
  if (riskLevel === 'low') {
    return (
      <div className={`flex items-center gap-2 text-xs text-green-600 ${className}`}>
        <Shield className="h-3 w-3" />
        <span>Conexão segura</span>
      </div>
    );
  }

  return null;
};
