
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, X, Search, Filter, Clock, User2, MessageSquare, Paperclip, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserActivityLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface ActivityLog {
  id: string;
  event_type: string;
  event_category: string;
  action: string;
  description: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: any;
  risk_level?: string;
  success?: boolean;
  created_at: string;
}

const UserActivityLogsDialog: React.FC<UserActivityLogsDialogProps> = ({
  open,
  onOpenChange,
  user
}) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    if (open && user?.id) {
      loadActivityLogs();
    }
  }, [open, user?.id]);

  const loadActivityLogs = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Erro ao carregar logs:', error);
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'comment_created':
      case 'comment_liked':
        return <MessageSquare className="h-4 w-4" />;
      case 'file_uploaded':
      case 'file_attached':
        return <Paperclip className="h-4 w-4" />;
      case 'supplier_created':
      case 'partner_created':
      case 'tool_created':
        return <Plus className="h-4 w-4" />;
      case 'navigation':
        return <Activity className="h-4 w-4" />;
      case 'auth_login':
      case 'auth_logout':
        return <User2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  };

  const getActionDescription = (log: ActivityLog) => {
    if (log.description) return log.description;
    
    // Fallback descriptions
    switch (log.event_type) {
      case 'comment_created':
        return 'Criou um comentário';
      case 'comment_liked':
        return 'Curtiu um comentário';
      case 'file_uploaded':
        return 'Fez upload de um arquivo';
      case 'supplier_created':
        return 'Cadastrou um fornecedor';
      case 'navigation':
        return `Navegou para ${log.metadata?.current_path || 'uma página'}`;
      case 'auth_login':
        return 'Fez login no sistema';
      case 'auth_logout':
        return 'Fez logout do sistema';
      default:
        return log.action || 'Ação realizada';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      getActionDescription(log).toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "" || log.event_category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(logs.map(log => log.event_category))];

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <DialogTitle>Logs de Atividade</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Histórico de atividades de <strong>{user.name}</strong> ({user.email})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar atividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={loadActivityLogs}
              disabled={isLoading}
            >
              <Filter className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          {/* Lista de Logs */}
          <ScrollArea className="flex-1 border rounded-md">
            <div className="p-4 space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Carregando logs de atividade...
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || filterCategory 
                    ? "Nenhum log encontrado com os filtros aplicados"
                    : "Nenhum log de atividade encontrado"
                  }
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(log.event_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {getActionDescription(log)}
                        </span>
                        {log.risk_level && (
                          <Badge variant={getRiskLevelColor(log.risk_level)} className="text-xs">
                            {log.risk_level}
                          </Badge>
                        )}
                        {log.success === false && (
                          <Badge variant="destructive" className="text-xs">
                            Falhou
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-4">
                        <span>
                          {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {log.event_category}
                        </span>
                        {log.entity_type && (
                          <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">
                            {log.entity_type}
                          </span>
                        )}
                      </div>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                            Ver detalhes
                          </summary>
                          <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserActivityLogsDialog;
