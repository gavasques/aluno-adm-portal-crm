
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentStatusProps {
  onPaymentConfirmed?: () => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ onPaymentConfirmed }) => {
  const [searchParams] = useSearchParams();
  const [isChecking, setIsChecking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'error' | null>(null);

  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (success === 'true' && sessionId) {
      checkPaymentStatus();
    } else if (cancelled === 'true') {
      setPaymentStatus('error');
      toast.error('Compra cancelada pelo usuário');
    }
  }, [success, cancelled, sessionId]);

  const checkPaymentStatus = async () => {
    if (!sessionId) return;

    setIsChecking(true);
    setPaymentStatus('checking');

    try {
      console.log('🔍 Verificando status do pagamento...', { sessionId });
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setPaymentStatus('success');
        if (data.credits_added) {
          toast.success(`${data.credits_added} créditos adicionados com sucesso!`);
        }
        onPaymentConfirmed?.();
      } else {
        setPaymentStatus('error');
        toast.error(data.message || 'Erro na verificação do pagamento');
      }
    } catch (err) {
      console.error('❌ Erro ao verificar pagamento:', err);
      setPaymentStatus('error');
      toast.error('Erro ao verificar pagamento');
    } finally {
      setIsChecking(false);
    }
  };

  if (!success && !cancelled) return null;

  return (
    <div className="mb-6">
      {paymentStatus === 'checking' && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Verificando status do pagamento...
          </AlertDescription>
        </Alert>
      )}

      {paymentStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Pagamento confirmado! Seus créditos foram adicionados à sua conta.
          </AlertDescription>
        </Alert>
      )}

      {paymentStatus === 'error' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {cancelled === 'true' 
              ? 'Compra cancelada. Nenhum valor foi cobrado.'
              : 'Houve um problema na verificação do pagamento. Entre em contato com o suporte.'
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
