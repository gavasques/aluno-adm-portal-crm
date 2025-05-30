
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Play, Square, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Session {
  id: string;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
  isActive: boolean;
}

const LiviAI = () => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar sessões do localStorage
  useEffect(() => {
    if (user?.id) {
      const storedSessions = localStorage.getItem(`livi_ai_sessions_${user.id}`);
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(parsedSessions);
      }
    }
  }, [user?.id]);

  // Salvar sessões no localStorage
  const saveSessions = (updatedSessions: Session[]) => {
    if (user?.id) {
      localStorage.setItem(`livi_ai_sessions_${user.id}`, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    }
  };

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // Iniciar nova sessão
  const startSession = () => {
    if (currentSession?.isActive) {
      toast({
        title: "Sessão ativa",
        description: "Encerre a sessão atual antes de iniciar uma nova.",
        variant: "destructive"
      });
      return;
    }

    const newSession: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date(),
      messages: [],
      isActive: true
    };

    setCurrentSession(newSession);
    setSelectedSession(newSession.id);

    // Timer para encerrar sessão em 1 hora
    sessionTimeoutRef.current = setTimeout(() => {
      endSession();
      toast({
        title: "Sessão encerrada",
        description: "A sessão foi encerrada automaticamente após 1 hora de inatividade."
      });
    }, 60 * 60 * 1000); // 1 hora

    toast({
      title: "Sessão iniciada",
      description: "Nova sessão do Livi AI iniciada com sucesso!"
    });
  };

  // Encerrar sessão
  const endSession = () => {
    if (!currentSession) return;

    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }

    const endedSession = {
      ...currentSession,
      endTime: new Date(),
      isActive: false
    };

    const updatedSessions = [...sessions.filter(s => s.id !== currentSession.id), endedSession];
    saveSessions(updatedSessions);
    setCurrentSession(null);

    toast({
      title: "Sessão encerrada",
      description: "Sessão do Livi AI encerrada com sucesso!"
    });
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!message.trim() || !currentSession || !user) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };
    setCurrentSession(updatedSession);
    setMessage('');
    setIsLoading(true);

    try {
      // Enviar para o webhook do n8n
      const response = await fetch('https://n8n.guilhermevasques.club/webhook/mensagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensagem: userMessage.text,
          usuario: user.email || user.id,
          sessao: currentSession.id
        })
      });

      if (response.ok) {
        const aiResponse = await response.text();
        
        const aiMessage: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: aiResponse || 'Mensagem recebida!',
          sender: 'ai',
          timestamp: new Date()
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, aiMessage]
        };
        setCurrentSession(finalSession);

        // Salvar sessão atualizada
        const updatedSessions = [...sessions.filter(s => s.id !== currentSession.id), finalSession];
        saveSessions(updatedSessions);
      } else {
        throw new Error('Erro na comunicação com o AI');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Selecionar sessão do histórico
  const selectSession = (sessionId: string) => {
    if (currentSession?.isActive && sessionId !== currentSession.id) {
      toast({
        title: "Sessão ativa",
        description: "Encerre a sessão atual para visualizar sessões anteriores.",
        variant: "destructive"
      });
      return;
    }

    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(sessionId);
      if (!session.isActive) {
        setCurrentSession(null);
      }
    }
  };

  const displaySession = currentSession || sessions.find(s => s.id === selectedSession);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar do Histórico */}
      <motion.div 
        className="w-80 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-r border-white/20 flex flex-col"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-4 border-b border-white/20">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Histórico de Sessões</h3>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedSession === session.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => selectSession(session.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">
                        {session.startTime.toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant={session.isActive ? "default" : "secondary"}>
                      {session.isActive ? "Ativa" : "Encerrada"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{session.startTime.toLocaleTimeString()}</span>
                    {session.endTime && (
                      <>
                        <span>-</span>
                        <span>{session.endTime.toLocaleTimeString()}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {session.messages.length} mensagens
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Área Principal do Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div 
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-white/20 p-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Livi AI</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentSession?.isActive ? 'Sessão ativa' : 'Nenhuma sessão ativa'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={startSession} 
                disabled={currentSession?.isActive}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Iniciar Sessão
              </Button>
              <Button 
                onClick={endSession} 
                disabled={!currentSession?.isActive}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Encerrar Sessão
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Área de Mensagens */}
        <ScrollArea className="flex-1 p-4">
          {displaySession ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {displaySession.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-white backdrop-blur-xl'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Bem-vindo ao Livi AI
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Inicie uma nova sessão para começar a conversar
                </p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input de Mensagem */}
        {currentSession?.isActive && (
          <motion.div 
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-t border-white/20 p-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!message.trim() || isLoading}
                size="sm"
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isLoading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiviAI;
