import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, GraduationCap, Users, Calendar, AlertCircle, Plus, Clock, Gift, Calculator, Trash2 } from 'lucide-react';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import { StudentMentoringEnrollment, CreateExtensionData, MentoringExtension } from '@/types/mentoring.types';
import { AddCustomMonthsDialog } from './extensions/AddCustomMonthsDialog';
import { AddMentoringExtensionDialog } from './extensions/AddMentoringExtensionDialog';
import { RemoveExtensionDialog } from './extensions/RemoveExtensionDialog';
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';

const editEnrollmentSchema = z.object({
  responsibleMentor: z.string().min(1, 'Mentor responsável é obrigatório'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().min(1, 'Data de fim é obrigatória'),
  status: z.enum(['ativa', 'concluida', 'cancelada', 'pausada'], {
    required_error: 'Status é obrigatório'
  }),
  observations: z.string().optional()
});

type EditEnrollmentFormData = z.infer<typeof editEnrollmentSchema>;

interface EditEnrollmentFormProps {
  enrollment: StudentMentoringEnrollment;
  onSubmit: (data: EditEnrollmentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onAddExtension?: (data: CreateExtensionData) => void;
  onRemoveExtension?: (extensionId: string) => void;
}

const EditEnrollmentForm = ({ 
  enrollment, 
  onSubmit, 
  onCancel, 
  isLoading,
  onAddExtension,
  onRemoveExtension
}: EditEnrollmentFormProps) => {
  const { mentors, loading: mentorsLoading } = useMentorsForEnrollment();
  const { students } = useStudentsForEnrollment();
  const { activeStudents } = useActiveStudentsForMentoring();
  const [showCustomMonthsDialog, setShowCustomMonthsDialog] = useState(false);
  const [showMentoringExtensionDialog, setShowMentoringExtensionDialog] = useState(false);
  const [showRemoveExtensionDialog, setShowRemoveExtensionDialog] = useState(false);
  const [selectedExtensionToRemove, setSelectedExtensionToRemove] = useState<MentoringExtension | null>(null);

  // Buscar informações do estudante
  const student = students?.find(s => s.id === enrollment.studentId);
  const studentName = student?.name || student?.email || `Aluno ${enrollment.studentId.slice(-8)}`;

  // Calcular totais
  const originalMonths = enrollment.mentoring.durationMonths;
  const extensionMonths = enrollment.extensions?.reduce((sum, ext) => sum + ext.extensionMonths, 0) || 0;
  const totalMonths = originalMonths + extensionMonths;

  const form = useForm<EditEnrollmentFormData>({
    resolver: zodResolver(editEnrollmentSchema),
    defaultValues: {
      responsibleMentor: enrollment.responsibleMentor,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
      status: enrollment.status,
      observations: enrollment.observations || ''
    }
  });

  const handleSubmit = (data: EditEnrollmentFormData) => {
    console.log('Form submit data:', data);
    onSubmit(data);
  };

  const handleExtensionSubmit = (data: CreateExtensionData) => {
    if (onAddExtension) {
      onAddExtension(data);
    }
  };

  const handleRemoveExtension = (extension: MentoringExtension) => {
    setSelectedExtensionToRemove(extension);
    setShowRemoveExtensionDialog(true);
  };

  const handleConfirmRemoveExtension = (extensionId: string) => {
    if (onRemoveExtension) {
      onRemoveExtension(extensionId);
    }
    setShowRemoveExtensionDialog(false);
    setSelectedExtensionToRemove(null);
  };

  return (
    <div className="space-y-6">
      {/* Informações não editáveis */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-gray-900 mb-3">Informações da Inscrição</h3>
        
        {/* Aluno */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-sm">{studentName}</span>
            </div>
            <p className="text-xs text-gray-500">{student?.email || enrollment.studentId}</p>
          </div>
          <Badge variant="outline" className="ml-auto">Não editável</Badge>
        </div>

        {/* Mentoria */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{enrollment.mentoring.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">{enrollment.mentoring.type}</Badge>
              <span className="text-xs text-gray-500">{enrollment.mentoring.durationMonths} {enrollment.mentoring.durationMonths === 1 ? 'mês' : 'meses'}</span>
              <span className="text-xs text-gray-500">R$ {enrollment.mentoring.price.toFixed(2)}</span>
            </div>
          </div>
          <Badge variant="outline">Não editável</Badge>
        </div>
      </div>

      {/* Resumo de Meses e Sessões */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Resumo Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Meses Originais</div>
              <div className="text-2xl font-bold text-blue-600">{originalMonths}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Plus className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Meses Extras</div>
              <div className="text-2xl font-bold text-green-600">+{extensionMonths}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calculator className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Total de Meses</div>
              <div className="text-2xl font-bold text-purple-600">{totalMonths}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Total de Sessões</div>
              <div className="text-2xl font-bold text-orange-600">{enrollment.totalSessions}</div>
              <div className="text-xs text-gray-500 mt-1">
                {enrollment.sessionsUsed} utilizadas • {enrollment.totalSessions - enrollment.sessionsUsed} restantes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extensões e Meses Extras */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Extensões e Meses Extras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Extensões existentes */}
          {enrollment.extensions && enrollment.extensions.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Extensões Aplicadas:</h4>
              <div className="space-y-2">
                {enrollment.extensions.map((extension, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        +{extension.extensionMonths} {extension.extensionMonths === 1 ? 'mês' : 'meses'}
                      </span>
                      {extension.notes && (
                        <span className="text-xs text-green-600 ml-2">
                          ({extension.notes})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600">
                        {new Date(extension.appliedDate).toLocaleDateString('pt-BR')}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveExtension(extension)}
                        className="h-6 w-6 p-0 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botões para adicionar extensões */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMentoringExtensionDialog(true)}
              className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4" />
              Adicionar Extensão da Mentoria
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCustomMonthsDialog(true)}
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              Adicionar Meses Avulsos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulário editável */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informações Editáveis
            </h3>

            {/* Mentor Responsável */}
            <FormField
              control={form.control}
              name="responsibleMentor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Mentor Responsável *
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={mentorsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue 
                          placeholder={mentorsLoading ? "Carregando mentores..." : "Selecione um mentor"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mentors.length === 0 ? (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          {mentorsLoading ? 'Carregando...' : 'Nenhum mentor encontrado'}
                        </div>
                      ) : (
                        mentors.map((mentor) => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {mentor.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium">{mentor.name}</span>
                                <span className="text-gray-600 text-sm ml-2">({mentor.email})</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Status *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ativa">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Ativa
                        </div>
                      </SelectItem>
                      <SelectItem value="pausada">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          Pausada
                        </div>
                      </SelectItem>
                      <SelectItem value="concluida">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Concluída
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelada">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Cancelada
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações sobre a inscrição..." 
                      className="min-h-20 bg-white resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || mentorsLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialogs para extensões */}
      <AddCustomMonthsDialog
        open={showCustomMonthsDialog}
        onOpenChange={setShowCustomMonthsDialog}
        enrollment={enrollment}
        onSubmit={handleExtensionSubmit}
        isLoading={isLoading}
      />

      <AddMentoringExtensionDialog
        open={showMentoringExtensionDialog}
        onOpenChange={setShowMentoringExtensionDialog}
        enrollment={enrollment}
        onSubmit={handleExtensionSubmit}
        isLoading={isLoading}
      />

      <RemoveExtensionDialog
        open={showRemoveExtensionDialog}
        onOpenChange={setShowRemoveExtensionDialog}
        enrollment={enrollment}
        extension={selectedExtensionToRemove}
        onConfirmRemove={handleConfirmRemoveExtension}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditEnrollmentForm;
