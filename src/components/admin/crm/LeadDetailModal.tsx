
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsTriggerWithBadge } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  X, 
  User, 
  FileText, 
  MessageSquare, 
  Clock, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  Globe,
  DollarSign,
  Tags,
  UserCheck,
  Edit,
  Star,
  Activity
} from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { motion, AnimatePresence } from 'framer-motion';
import LeadDataTab from './lead-detail-tabs/LeadDataTab';
import LeadAttachmentsTab from './lead-detail-tabs/LeadAttachmentsTab';
import LeadCommentsTab from './lead-detail-tabs/LeadCommentsTab';
import LeadHistoryTab from './lead-detail-tabs/LeadHistoryTab';

interface LeadDetailModalProps {
  lead: CRMLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdate?: () => void;
}

const LeadDetailModal = ({ lead, open, onOpenChange, onLeadUpdate }: LeadDetailModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!lead) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getScoreColor = (hasCompany: boolean, amazonSeller: boolean, ready3k: boolean) => {
    const score = (hasCompany ? 1 : 0) + (amazonSeller ? 1 : 0) + (ready3k ? 2 : 0);
    if (score >= 3) return 'text-green-600 bg-green-50';
    if (score >= 2) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col p-0 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              {/* Header glassmorphic */}
              <div className="relative p-6 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <Avatar className="h-16 w-16 ring-4 ring-white/20 shadow-xl">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                          {getInitials(lead.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </motion.div>
                    
                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                      
                      {/* Tags */}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {lead.tags.slice(0, 3).map(tag => (
                            <Badge 
                              key={tag.id} 
                              variant="outline" 
                              className="text-xs backdrop-blur-sm"
                              style={{ 
                                backgroundColor: tag.color + '15', 
                                color: tag.color,
                                borderColor: tag.color + '30'
                              }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {lead.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50/80 text-gray-600">
                              +{lead.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Score de qualificação */}
                    <div className={`px-3 py-2 rounded-lg ${getScoreColor(lead.has_company, lead.sells_on_amazon, lead.ready_to_invest_3k)} backdrop-blur-sm`}>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-medium">Score</span>
                      </div>
                    </div>

                    {/* Status */}
                    {lead.column && (
                      <Badge 
                        className="backdrop-blur-sm"
                        style={{ 
                          backgroundColor: lead.column.color + '20',
                          borderColor: lead.column.color + '40',
                          color: lead.column.color
                        }}
                      >
                        {lead.column.name}
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenChange(false)}
                      className="h-8 w-8 p-0 hover:bg-white/20 backdrop-blur-sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs Container */}
              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="border-b border-gray-200/50 bg-white/50 backdrop-blur-sm px-6">
                    <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm">
                      <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <User className="h-4 w-4" />
                        Visão Geral
                      </TabsTrigger>
                      <TabsTrigger value="data" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <FileText className="h-4 w-4" />
                        Dados Completos
                      </TabsTrigger>
                      <TabsTriggerWithBadge 
                        value="attachments" 
                        badgeContent="3"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <FileText className="h-4 w-4" />
                        Anexos
                      </TabsTriggerWithBadge>
                      <TabsTriggerWithBadge 
                        value="comments" 
                        badgeContent="2"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Comentários
                      </TabsTriggerWithBadge>
                      <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Clock className="h-4 w-4" />
                        Histórico
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="overview" className="h-full mt-0 p-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full overflow-y-auto"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                          {/* Coluna principal - Informações básicas */}
                          <div className="lg:col-span-2 space-y-6">
                            {/* Informações de contato */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Informações de Contato
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="text-xs text-gray-500">Email</p>
                                      <p className="font-medium">{lead.email}</p>
                                    </div>
                                  </div>
                                  {lead.scheduled_contact_date && (
                                    <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-lg">
                                      <Calendar className="h-4 w-4 text-green-600" />
                                      <div>
                                        <p className="text-xs text-gray-500">Próximo contato</p>
                                        <p className="font-medium">{formatDate(lead.scheduled_contact_date)}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-3">
                                  {lead.phone && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                                      <Phone className="h-4 w-4 text-green-600" />
                                      <div>
                                        <p className="text-xs text-gray-500">Telefone</p>
                                        <p className="font-medium">{lead.phone}</p>
                                      </div>
                                    </div>
                                  )}
                                  {lead.responsible && (
                                    <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-lg">
                                      <UserCheck className="h-4 w-4 text-purple-600" />
                                      <div>
                                        <p className="text-xs text-gray-500">Responsável</p>
                                        <p className="font-medium">{lead.responsible.name}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Informações de negócio */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-orange-600" />
                                Informações de Negócio
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl ${lead.has_company ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
                                  <Building2 className={`h-8 w-8 mb-2 ${lead.has_company ? 'text-green-600' : 'text-gray-400'}`} />
                                  <p className="text-sm font-medium">{lead.has_company ? 'Tem empresa' : 'Pessoa física'}</p>
                                </div>
                                <div className={`p-4 rounded-xl ${lead.sells_on_amazon ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'} border`}>
                                  <Globe className={`h-8 w-8 mb-2 ${lead.sells_on_amazon ? 'text-orange-600' : 'text-gray-400'}`} />
                                  <p className="text-sm font-medium">{lead.sells_on_amazon ? 'Vende na Amazon' : 'Não vende na Amazon'}</p>
                                </div>
                                <div className={`p-4 rounded-xl ${lead.ready_to_invest_3k ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
                                  <DollarSign className={`h-8 w-8 mb-2 ${lead.ready_to_invest_3k ? 'text-green-600' : 'text-gray-400'}`} />
                                  <p className="text-sm font-medium">{lead.ready_to_invest_3k ? 'Pronto p/ R$ 3k' : 'Não qualificado'}</p>
                                </div>
                              </div>
                              
                              {lead.what_sells && (
                                <div className="mt-4 p-3 bg-blue-50/50 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">O que vende</p>
                                  <p className="text-sm font-medium">{lead.what_sells}</p>
                                </div>
                              )}
                            </div>

                            {/* Observações */}
                            {(lead.main_doubts || lead.notes) && (
                              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-gray-600" />
                                  Observações
                                </h3>
                                <div className="space-y-4">
                                  {lead.main_doubts && (
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 mb-2">Principais dúvidas:</p>
                                      <p className="text-sm text-gray-600 bg-yellow-50/50 p-3 rounded-lg">{lead.main_doubts}</p>
                                    </div>
                                  )}
                                  {lead.notes && (
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 mb-2">Observações gerais:</p>
                                      <p className="text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg">{lead.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Sidebar direita - Atividades recentes */}
                          <div className="space-y-6">
                            {/* Atividades recentes */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-purple-600" />
                                Atividades Recentes
                              </h3>
                              <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  <div>
                                    <p className="text-sm font-medium">Lead criado</p>
                                    <p className="text-xs text-gray-500">{formatDate(lead.created_at)}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-green-50/50 rounded-lg">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                  <div>
                                    <p className="text-sm font-medium">Status atualizado</p>
                                    <p className="text-xs text-gray-500">Há 2 dias</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-orange-50/50 rounded-lg">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                  <div>
                                    <p className="text-sm font-medium">Comentário adicionado</p>
                                    <p className="text-xs text-gray-500">Há 3 dias</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Quick actions */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                              <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                              <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start bg-white/50 hover:bg-white/80">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar Lead
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-white/50 hover:bg-white/80">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Adicionar Comentário
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-white/50 hover:bg-white/80">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Agendar Contato
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="data" className="h-full mt-0">
                      <LeadDataTab lead={lead} onUpdate={onLeadUpdate} />
                    </TabsContent>
                    
                    <TabsContent value="attachments" className="h-full mt-0">
                      <LeadAttachmentsTab leadId={lead.id} />
                    </TabsContent>
                    
                    <TabsContent value="comments" className="h-full mt-0">
                      <LeadCommentsTab leadId={lead.id} />
                    </TabsContent>
                    
                    <TabsContent value="history" className="h-full mt-0">
                      <LeadHistoryTab leadId={lead.id} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LeadDetailModal;
