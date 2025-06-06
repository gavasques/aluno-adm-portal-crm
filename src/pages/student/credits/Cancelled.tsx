
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const CreditCancelled = () => {
  const navigate = useNavigate();

  const handleBackToCredits = () => {
    navigate('/aluno/creditos');
  };

  const handleTryAgain = () => {
    navigate('/aluno/creditos');
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <XCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <CardTitle className="text-orange-600">Compra Cancelada</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Sua compra de créditos foi cancelada. Nenhum valor foi cobrado.
          </p>
          
          <div className="bg-orange-50 p-4 rounded-lg text-sm text-orange-800">
            <p className="font-semibold mb-1">💡 Precisa de ajuda?</p>
            <p>
              Se você teve algum problema durante o pagamento, entre em contato 
              com nosso suporte para assistência.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleTryAgain} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            
            <Button onClick={handleBackToCredits} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Créditos
            </Button>
          </div>

          <div className="text-xs text-gray-500 border-t pt-4">
            <p>Caso continue enfrentando problemas:</p>
            <p>📧 suporte@exemplo.com</p>
            <p>📱 WhatsApp: (11) 99999-9999</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditCancelled;
