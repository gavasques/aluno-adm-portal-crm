
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CreditSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const credits = searchParams.get('credits');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setError('Session ID não encontrado');
      setIsVerifying(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      console.log('🔍 Verificando pagamento...', { sessionId });
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) {
        throw error;
      }

      console.log('✅ Resultado da verificação:', data);
      setVerificationResult(data);

      if (data.success) {
        if (data.already_processed) {
          toast.success('Pagamento já foi processado anteriormente!');
        } else if (data.payment_verified) {
          toast.success(`${data.credits_added} créditos adicionados com sucesso!`);
        }
      } else {
        setError(data.message || 'Erro na verificação do pagamento');
      }
    } catch (err) {
      console.error('❌ Erro ao verificar pagamento:', err);
      setError('Erro ao verificar pagamento. Tente novamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToCredits = () => {
    navigate('/aluno/creditos');
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Verificando Pagamento</h2>
            <p className="text-gray-600">
              Aguarde enquanto confirmamos seu pagamento...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Erro na Verificação</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={verifyPayment} variant="outline">
                Tentar Novamente
              </Button>
              <Button onClick={handleBackToCredits}>
                Voltar aos Créditos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-green-600">Pagamento Confirmado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verificationResult?.credits_added && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-green-800">
                +{verificationResult.credits_added} créditos
              </p>
              <p className="text-sm text-green-600">adicionados à sua conta</p>
            </div>
          )}

          {verificationResult?.new_total && (
            <p className="text-gray-600">
              Seu saldo atual: <span className="font-semibold">{verificationResult.new_total} créditos</span>
            </p>
          )}

          {verificationResult?.already_processed && (
            <p className="text-orange-600 text-sm">
              Este pagamento já foi processado anteriormente.
            </p>
          )}

          <Button onClick={handleBackToCredits} className="w-full">
            Voltar aos Meus Créditos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditSuccess;
