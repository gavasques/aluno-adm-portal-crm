
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, History, Zap, MessageSquare } from 'lucide-react';

const LiviAI = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setIsLoading(true);
    // Simular envio de mensagem
    setTimeout(() => {
      setIsLoading(false);
      setMessage('');
    }, 2000);
  };

  const recentSessions = [
    {
      id: 1,
      title: "Estratégias de Marketing Digital",
      timestamp: "Há 2 horas",
      messages: 15
    },
    {
      id: 2,
      title: "Análise de Concorrência",
      timestamp: "Ontem",
      messages: 8
    },
    {
      id: 3,
      title: "Planejamento Financeiro",
      timestamp: "2 dias atrás",
      messages: 22
    }
  ];

  return (
    <div className="h-full flex">
      {/* Sidebar com histórico */}
      <div className="w-80 border-r bg-gray-50 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <h3 className="font-semibold">Conversas Recentes</h3>
        </div>
        
        <div className="space-y-2">
          {recentSessions.map((session) => (
            <Card key={session.id} className="cursor-pointer hover:bg-white transition-colors">
              <CardContent className="p-3">
                <h4 className="font-medium text-sm">{session.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-600">{session.timestamp}</p>
                  <Badge variant="outline" className="text-xs">
                    {session.messages} msgs
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button className="w-full" variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold">Livi AI</h2>
                <p className="text-sm text-gray-600">Assistente inteligente</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">1,250 créditos</span>
            </div>
          </div>
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Mensagem de boas-vindas */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm max-w-md">
                <p className="text-gray-900">
                  Olá! Sou o Livi, seu assistente de IA. Como posso ajudá-lo hoje? 
                  Posso auxiliar com estratégias de negócio, análises, planejamento e muito mais!
                </p>
              </div>
            </div>

            {/* Sugestões */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:bg-blue-50 transition-colors">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">💡 Ideias de Negócio</h4>
                  <p className="text-xs text-gray-600 mt-1">Brainstorming de oportunidades</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-blue-50 transition-colors">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">📊 Análise de Mercado</h4>
                  <p className="text-xs text-gray-600 mt-1">Insights sobre seu setor</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-blue-50 transition-colors">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">🎯 Estratégia Marketing</h4>
                  <p className="text-xs text-gray-600 mt-1">Planeje suas campanhas</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Input de mensagem */}
        <div className="border-t p-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <Input
                placeholder="Digite sua mensagem para o Livi..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="px-6"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Cada mensagem consome entre 5-15 créditos dependendo da complexidade
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiviAI;
