
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignInOut } from '@/hooks/auth/useBasicAuth/useSignInOut';

const NoAccess = () => {
  const { signOut } = useSignInOut();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Sem Acesso Configurado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Sua conta ainda não possui permissões configuradas para acessar o sistema.
          </p>
          <p className="text-sm text-gray-500">
            Entre em contato com o administrador para configurar suas permissões de acesso.
          </p>
          
          <div className="pt-4 space-y-2">
            <Link to="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Fazer Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoAccess;
