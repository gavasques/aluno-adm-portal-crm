
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import ExtensionsManager from '../ExtensionsManager';
import { MentoringExtensionOption } from '@/types/mentoring.types';

interface ExtensionsTabProps {
  extensions: MentoringExtensionOption[];
  onExtensionsChange: (extensions: MentoringExtensionOption[]) => void;
  baseDurationMonths?: number;
  basePrice?: number;
  frequency?: 'Semanal' | 'Quinzenal' | 'Mensal';
}

const ExtensionsTab: React.FC<ExtensionsTabProps> = ({ 
  extensions, 
  onExtensionsChange,
  baseDurationMonths = 3,
  basePrice = 100,
  frequency = 'Semanal'
}) => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-600">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-100 to-indigo-100">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          ⚡ Gerenciar Extensões
          {extensions && extensions.length > 0 && (
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-700 border-blue-200 text-xs">
              {extensions.length} ativa(s)
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">Configure extensões adicionais para oferecer aos alunos</p>
      </CardHeader>
      <CardContent className="p-6">
        <ExtensionsManager
          extensions={extensions || []}
          onExtensionsChange={onExtensionsChange}
          baseDurationMonths={baseDurationMonths}
          basePrice={basePrice}
          frequency={frequency}
        />
      </CardContent>
    </Card>
  );
};

export default ExtensionsTab;
