
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const FUNCTIONALITY_CHECKLIST: ChecklistItem[] = [
  // Visualização de dados
  { id: 'list-users', title: 'Listar usuários', description: 'Exibir todos os usuários com informações básicas', priority: 'high', category: 'Visualização' },
  { id: 'user-search', title: 'Buscar usuários', description: 'Pesquisar por nome ou email', priority: 'high', category: 'Filtros' },
  { id: 'user-filters', title: 'Filtrar usuários', description: 'Filtrar por status, grupo, etc.', priority: 'medium', category: 'Filtros' },
  { id: 'user-pagination', title: 'Paginação', description: 'Navegar entre páginas de usuários', priority: 'medium', category: 'Navegação' },
  
  // CRUD Operations
  { id: 'add-user', title: 'Adicionar usuário', description: 'Criar novo usuário com senha', priority: 'high', category: 'CRUD' },
  { id: 'invite-user', title: 'Convidar usuário', description: 'Enviar convite por email', priority: 'high', category: 'CRUD' },
  { id: 'view-details', title: 'Ver detalhes', description: 'Visualizar informações completas do usuário', priority: 'high', category: 'CRUD' },
  { id: 'edit-user', title: 'Editar usuário', description: 'Modificar informações do usuário', priority: 'high', category: 'CRUD' },
  { id: 'delete-user', title: 'Excluir usuário', description: 'Remover usuário do sistema', priority: 'high', category: 'CRUD' },
  
  // Gerenciamento de estado
  { id: 'toggle-status', title: 'Ativar/Desativar', description: 'Alterar status do usuário', priority: 'high', category: 'Status' },
  { id: 'reset-password', title: 'Redefinir senha', description: 'Enviar email de redefinição', priority: 'high', category: 'Segurança' },
  { id: 'set-permissions', title: 'Definir permissões', description: 'Atribuir grupo de permissão', priority: 'high', category: 'Permissões' },
  
  // Funcionalidades avançadas
  { id: 'storage-management', title: 'Gerenciar armazenamento', description: 'Visualizar e aumentar limite de storage', priority: 'medium', category: 'Storage' },
  { id: 'mentor-toggle', title: 'Toggle mentor', description: 'Definir/remover papel de mentor', priority: 'medium', category: 'Roles' },
  { id: 'bulk-actions', title: 'Ações em lote', description: 'Executar ações em múltiplos usuários', priority: 'low', category: 'Bulk' },
  
  // UX/Performance
  { id: 'loading-states', title: 'Estados de carregamento', description: 'Feedback visual durante operações', priority: 'medium', category: 'UX' },
  { id: 'error-handling', title: 'Tratamento de erros', description: 'Mensagens claras para erros', priority: 'high', category: 'UX' },
  { id: 'responsive-design', title: 'Design responsivo', description: 'Funcionar bem em mobile', priority: 'medium', category: 'UX' },
];

export const FunctionalityChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const handleCheck = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const categories = [...new Set(FUNCTIONALITY_CHECKLIST.map(item => item.category))];
  const completedCount = checkedItems.size;
  const totalCount = FUNCTIONALITY_CHECKLIST.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Checklist de Funcionalidades</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {completedCount}/{totalCount} ({completionPercentage}%)
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Use este checklist para validar se todas as funcionalidades estão funcionando corretamente na nova versão.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map(category => {
            const categoryItems = FUNCTIONALITY_CHECKLIST.filter(item => item.category === category);
            const categoryCompleted = categoryItems.filter(item => checkedItems.has(item.id)).length;
            
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-700">{category}</h4>
                  <Badge variant="outline" className="text-xs">
                    {categoryCompleted}/{categoryItems.length}
                  </Badge>
                </div>
                
                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                  {categoryItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                      <Checkbox
                        id={item.id}
                        checked={checkedItems.has(item.id)}
                        onCheckedChange={() => handleCheck(item.id)}
                        className="mt-0.5"
                      />
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <label 
                            htmlFor={item.id} 
                            className={`text-sm font-medium cursor-pointer ${
                              checkedItems.has(item.id) ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            {item.title}
                          </label>
                          {getPriorityIcon(item.priority)}
                          <Badge 
                            variant={getPriorityColor(item.priority) as any} 
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <p className={`text-xs text-gray-600 ${
                          checkedItems.has(item.id) ? 'line-through' : ''
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {completionPercentage === 100 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                🎉 Todas as funcionalidades foram testadas!
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              A nova versão está pronta para substituir a versão atual.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
