
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendlyConfigForm } from './CalendlyConfigForm';
import { CalendlyService } from '@/services/calendly/CalendlyService';
import { CalendlyConfig } from '@/types/calendly.types';
import { useMentors } from '@/hooks/useMentors';
import { useToast } from '@/hooks/use-toast';
import { Settings, ExternalLink, Plus, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MentorWithConfig {
  id: string;
  name: string;
  email: string;
  config?: CalendlyConfig;
}

export const CalendlyConfigList: React.FC = () => {
  const [mentorsWithConfigs, setMentorsWithConfigs] = useState<MentorWithConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorWithConfig | null>(null);
  const [configToDelete, setConfigToDelete] = useState<CalendlyConfig | null>(null);
  const { mentors } = useMentors();
  const { toast } = useToast();

  useEffect(() => {
    loadMentorsWithConfigs();
  }, [mentors]);

  const loadMentorsWithConfigs = async () => {
    setLoading(true);
    try {
      const mentorsWithConfigsData: MentorWithConfig[] = [];
      
      for (const mentor of mentors) {
        const config = await CalendlyService.getCalendlyConfigByMentor(mentor.id);
        mentorsWithConfigsData.push({
          ...mentor,
          config: config || undefined
        });
      }
      
      setMentorsWithConfigs(mentorsWithConfigsData);
    } catch (error) {
      console.error('Error loading mentors with configs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações do Calendly",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigMentor = (mentor: MentorWithConfig) => {
    setSelectedMentor(mentor);
    setShowConfigForm(true);
  };

  const handleDeleteConfig = async () => {
    if (!configToDelete) return;

    try {
      const success = await CalendlyService.updateCalendlyConfig(configToDelete.id, { active: false });
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Configuração desativada com sucesso!",
        });
        loadMentorsWithConfigs();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao desativar configuração",
        variant: "destructive",
      });
    } finally {
      setConfigToDelete(null);
    }
  };

  const getCalendlyUrl = (config: CalendlyConfig) => {
    return `https://calendly.com/${config.calendly_username}/${config.event_type_slug}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações do Calendly</h2>
          <p className="text-gray-600">Gerencie as credenciais do Calendly para cada mentor</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {mentorsWithConfigs.filter(m => m.config?.active).length} configurados
          </Badge>
          <Badge variant="outline">
            {mentorsWithConfigs.length} mentores
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentorsWithConfigs.map((mentor) => (
          <Card key={mentor.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{mentor.name}</CardTitle>
                {mentor.config ? (
                  <Badge variant={mentor.config.active ? "default" : "secondary"}>
                    {mentor.config.active ? "Ativo" : "Inativo"}
                  </Badge>
                ) : (
                  <Badge variant="outline">Não configurado</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{mentor.email}</p>
            </CardHeader>
            
            <CardContent>
              {mentor.config ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="text-sm font-medium">{mentor.config.calendly_username}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Event Type</p>
                    <p className="text-sm font-medium">{mentor.config.event_type_slug}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(getCalendlyUrl(mentor.config!), '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Testar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConfigMentor(mentor)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfigToDelete(mentor.config!)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-3">Calendly não configurado</p>
                  <Button
                    size="sm"
                    onClick={() => handleConfigMentor(mentor)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Configurar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Dialog */}
      {selectedMentor && (
        <CalendlyConfigForm
          open={showConfigForm}
          onOpenChange={setShowConfigForm}
          mentorId={selectedMentor.id}
          mentorName={selectedMentor.name}
          existingConfig={selectedMentor.config}
          onSuccess={loadMentorsWithConfigs}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!configToDelete} onOpenChange={(open) => !open && setConfigToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar Configuração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar esta configuração do Calendly? 
              Isso impedirá que novos agendamentos sejam feitos via Calendly para este mentor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfig}>
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
