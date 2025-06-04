
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings, Wifi } from 'lucide-react';
import { CORSTestPanel } from '@/components/debug/CORSTestPanel';

export const CORSDebugSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Só mostrar se estivermos no ambiente Lovable
  const isLovableEnvironment = window.location.hostname.includes('lovable.dev');
  
  if (!isLovableEnvironment) {
    return null;
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-base">Diagnóstico de Conectividade</CardTitle>
                  <CardDescription className="text-sm">
                    Testar conexão e resolver problemas de CORS
                  </CardDescription>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <CORSTestPanel />
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Settings className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Configuração necessária:</p>
                  <p className="text-yellow-700 mt-1">
                    Se houver erros de CORS, configure no Supabase Dashboard:
                  </p>
                  <p className="text-yellow-700 font-mono text-xs mt-1">
                    Settings → API → CORS Origins → Adicionar: https://lovable.dev e *.lovable.dev
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
