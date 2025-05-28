
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ban, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/auth';

const BannedUserAccess: React.FC = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-red-100 p-4 rounded-full">
              <Ban className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Acesso Negado</h1>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-700 text-lg font-medium">
                Você não tem acesso ao sistema.
              </p>
              <p className="text-gray-600">
                Em caso de dúvidas, contate nosso suporte.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSignOut} 
              variant="destructive" 
              className="w-full"
              size="lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BannedUserAccess;
