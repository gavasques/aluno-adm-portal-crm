
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { TestTube, Send } from 'lucide-react';
import { toast } from 'sonner';

export const WebhookTestButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [testData, setTestData] = useState({
    name: 'João Silva (Teste)',
    email: 'teste@exemplo.com',
    phone: '(11) 99999-9999',
    has_company: true,
    sells_on_amazon: true,
    what_sells: 'Produtos eletrônicos'
  });
  const [isLoading, setIsLoading] = useState(false);

  const { pipelines } = useCRMPipelines();

  const handleTest = async () => {
    if (!selectedPipeline) {
      toast.error('Selecione um pipeline para testar');
      return;
    }

    setIsLoading(true);
    
    try {
      const webhookUrl = `https://qflmguzmticupqtnlirf.supabase.co/functions/v1/crm-webhook?pipeline_id=${selectedPipeline}`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Webhook testado com sucesso! Verifique os logs.');
        setIsOpen(false);
      } else {
        toast.error(`Erro no webhook: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast.error('Erro ao conectar com o webhook');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <TestTube className="h-4 w-4" />
          Testar Webhook
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Testar Webhook do CRM</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Pipeline</Label>
            <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={testData.name}
                onChange={(e) => setTestData({ ...testData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={testData.email}
                onChange={(e) => setTestData({ ...testData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input
              value={testData.phone}
              onChange={(e) => setTestData({ ...testData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>O que vende</Label>
            <Textarea
              value={testData.what_sells}
              onChange={(e) => setTestData({ ...testData, what_sells: e.target.value })}
              rows={2}
            />
          </div>

          <Button 
            onClick={handleTest} 
            disabled={isLoading || !selectedPipeline}
            className="w-full gap-2"
          >
            <Send className="h-4 w-4" />
            {isLoading ? 'Enviando...' : 'Enviar Teste'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
