
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

export const DebugUserData: React.FC = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkUserData = async () => {
    setIsLoading(true);
    try {
      // Check profiles table directly
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'contato@liberdadevirtual.tv');

      // Call edge function
      const { data: edgeFunctionData, error: edgeError } = await supabase.functions.invoke('list-users');

      setDebugData({
        profiles: { data: profilesData, error: profilesError },
        edgeFunction: { data: edgeFunctionData, error: edgeError },
        timestamp: new Date().toISOString()
      });

      console.log('🔍 Debug data collected:', {
        profiles: { data: profilesData, error: profilesError },
        edgeFunction: { data: edgeFunctionData, error: edgeError }
      });
    } catch (error) {
      console.error('Error checking user data:', error);
      setDebugData({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const andreFromEdge = debugData?.edgeFunction?.data?.users?.find(
    (u: any) => u.email === 'contato@liberdadevirtual.tv'
  );

  const andreFromProfiles = debugData?.profiles?.data?.[0];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Debug: André Ferreira Status
          <Button onClick={checkUserData} disabled={isLoading} size="sm">
            {isLoading ? 'Verificando...' : 'Verificar Dados'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {debugData && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Profiles Table:</h4>
              {andreFromProfiles ? (
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <p><strong>Email:</strong> {andreFromProfiles.email}</p>
                  <p><strong>Status:</strong> <Badge variant={andreFromProfiles.status === 'Ativo' ? 'default' : 'destructive'}>{andreFromProfiles.status}</Badge></p>
                  <p><strong>Updated At:</strong> {andreFromProfiles.updated_at}</p>
                </div>
              ) : (
                <p className="text-red-500">Não encontrado na tabela profiles</p>
              )}
            </div>

            <div>
              <h4 className="font-medium">Edge Function Response:</h4>
              {andreFromEdge ? (
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <p><strong>Email:</strong> {andreFromEdge.email}</p>
                  <p><strong>Status:</strong> <Badge variant={andreFromEdge.status === 'Ativo' ? 'default' : 'destructive'}>{andreFromEdge.status}</Badge></p>
                  <p><strong>ID:</strong> {andreFromEdge.id}</p>
                </div>
              ) : (
                <p className="text-red-500">Não encontrado na resposta da edge function</p>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Última verificação: {debugData.timestamp}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
