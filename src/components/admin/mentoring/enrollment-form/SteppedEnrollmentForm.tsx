import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Users,
  Calendar,
  BookOpen,
  User
} from 'lucide-react';

// Import com default export
import StudentSearchField from './StudentSearchField';
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MentoringCatalog } from '@/types/mentoring.types';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useToast } from '@/hooks/use-toast';
import MentoringSelector from './MentoringSelector';
import DateSelector from './DateSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SteppedEnrollmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const SteppedEnrollmentForm: React.FC<SteppedEnrollmentFormProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const { createEnrollment, loading } = useSupabaseMentoring();
  const { students } = useActiveStudentsForMentoring();
  
  // Form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentId: '',
    mentoringId: '',
    startDate: new Date(),
    endDate: null as Date | null,
    responsibleMentor: '',
    observations: '',
    paymentStatus: 'pendente',
    status: 'ativa'
  });
  
  // Selected entities
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedMentoring, setSelectedMentoring] = useState<MentoringCatalog | null>(null);
  
  // Progress calculation
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setFormData({
      ...formData,
      studentId: student.id
    });
  };
  
  const handleMentoringSelect = (mentoring: MentoringCatalog) => {
    setSelectedMentoring(mentoring);
    
    // Calculate end date based on mentoring duration
    const startDate = formData.startDate;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + mentoring.durationMonths);
    
    setFormData({
      ...formData,
      mentoringId: mentoring.id,
      endDate
    });
  };
  
  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
    setFormData({
      ...formData,
      [field]: date
    });
    
    // If start date changes and we have a mentoring selected, update end date
    if (field === 'startDate' && date && selectedMentoring) {
      const endDate = new Date(date);
      endDate.setMonth(endDate.getMonth() + selectedMentoring.durationMonths);
      setFormData(prev => ({
        ...prev,
        endDate
      }));
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async () => {
    try {
      if (createEnrollment) {
        const success = await createEnrollment({
          ...formData,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate ? formData.endDate.toISOString() : null
        });
        
        if (success) {
          toast({
            title: "Inscrição criada com sucesso",
            description: `${selectedStudent?.name} foi inscrito em ${selectedMentoring?.name}`,
            variant: "default"
          });
          
          onOpenChange(false);
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error('Error creating enrollment:', error);
      toast({
        title: "Erro ao criar inscrição",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    }
  };
  
  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!selectedStudent;
      case 2:
        return !!selectedMentoring;
      case 3:
        return !!formData.startDate && !!formData.endDate;
      case 4:
        return !!formData.responsibleMentor;
      default:
        return false;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nova Inscrição de Mentoria</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Passo {step} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between">
            <Badge 
              variant={step >= 1 ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <User className="h-3 w-3" />
              Aluno
            </Badge>
            <Badge 
              variant={step >= 2 ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <BookOpen className="h-3 w-3" />
              Mentoria
            </Badge>
            <Badge 
              variant={step >= 3 ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              Datas
            </Badge>
            <Badge 
              variant={step >= 4 ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Confirmação
            </Badge>
          </div>
          
          <Separator />
          
          {/* Step content */}
          <div className="min-h-[300px]">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Selecione o Aluno</h2>
                <StudentSearchField
                  selectedStudent={selectedStudent}
                  onStudentSelect={handleStudentSelect}
                  onClear={() => {
                    setSelectedStudent(null);
                    setFormData({...formData, studentId: ''});
                  }}
                />
                
                {selectedStudent && (
                  <Card className="mt-4 bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-blue-800">Aluno Selecionado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedStudent.name}</p>
                          <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Selecione a Mentoria</h2>
                <MentoringSelector
                  onMentoringSelect={handleMentoringSelect}
                  selectedMentoringId={formData.mentoringId}
                />
                
                {selectedMentoring && (
                  <Card className="mt-4 bg-purple-50 border-purple-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-purple-800">Mentoria Selecionada</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium">{selectedMentoring.name}</p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <Badge variant="outline" className="bg-white">
                            {selectedMentoring.type}
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {selectedMentoring.durationMonths} {selectedMentoring.durationMonths === 1 ? 'mês' : 'meses'}
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {selectedMentoring.numberOfSessions} sessões
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Defina as Datas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DateSelector
                    label="Data de Início"
                    date={formData.startDate}
                    onSelect={(date) => handleDateChange('startDate', date)}
                  />
                  <DateSelector
                    label="Data de Término"
                    date={formData.endDate}
                    onSelect={(date) => handleDateChange('endDate', date)}
                  />
                </div>
                
                {formData.startDate && formData.endDate && (
                  <Card className="mt-4 bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-800">Período da Mentoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-700" />
                          <p className="font-medium">
                            {format(formData.startDate, 'dd/MM/yyyy', { locale: ptBR })} até {format(formData.endDate, 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Duração: {selectedMentoring?.durationMonths} {selectedMentoring?.durationMonths === 1 ? 'mês' : 'meses'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Confirme os Detalhes</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="responsibleMentor">Mentor Responsável</Label>
                      <Input
                        id="responsibleMentor"
                        name="responsibleMentor"
                        value={formData.responsibleMentor}
                        onChange={handleInputChange}
                        placeholder="Nome do mentor responsável"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="paymentStatus">Status de Pagamento</Label>
                      <Select 
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onValueChange={(value) => setFormData({...formData, paymentStatus: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="parcial">Parcialmente Pago</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      value={formData.observations}
                      onChange={handleInputChange}
                      placeholder="Observações adicionais sobre esta inscrição"
                      className="h-32"
                    />
                  </div>
                </div>
                
                <Card className="mt-4 bg-gray-50 border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Resumo da Inscrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aluno:</span>
                        <span className="font-medium">{selectedStudent?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mentoria:</span>
                        <span className="font-medium">{selectedMentoring?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Período:</span>
                        <span className="font-medium">
                          {formData.startDate && format(formData.startDate, 'dd/MM/yyyy', { locale: ptBR })} - 
                          {formData.endDate && format(formData.endDate, 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sessões:</span>
                        <span className="font-medium">{selectedMentoring?.numberOfSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mentor:</span>
                        <span className="font-medium">{formData.responsibleMentor || 'Não definido'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status de Pagamento:</span>
                        <Badge variant={formData.paymentStatus === 'pago' ? 'default' : 'outline'}>
                          {formData.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={step === 1 ? () => onOpenChange(false) : handleBack}
              className="flex items-center gap-1"
            >
              {step === 1 ? 'Cancelar' : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </>
              )}
            </Button>
            
            <Button
              onClick={step === totalSteps ? handleSubmit : handleNext}
              disabled={!isStepValid() || (step === totalSteps && loading)}
              className="flex items-center gap-1"
            >
              {step === totalSteps ? (
                loading ? 'Salvando...' : 'Finalizar Inscrição'
              ) : (
                <>
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SteppedEnrollmentForm;
