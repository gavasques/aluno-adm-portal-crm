
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EnrollmentForm = ({ onSuccess, onCancel }: EnrollmentFormProps) => {
  const { catalogs, createEnrollment, loading } = useSupabaseMentoring();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    studentId: '',
    mentoringId: '',
    status: 'ativa',
    enrollmentDate: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    responsibleMentor: '',
    paymentStatus: 'pendente',
    observations: ''
  });

  const calculateEndDate = (startDate: string, mentoringId: string) => {
    if (!startDate || !mentoringId) return '';
    
    const mentoring = catalogs.find(c => c.id === mentoringId);
    if (!mentoring) return '';
    
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + mentoring.durationMonths);
    
    return end.toISOString().split('T')[0];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate end date when start date or mentoring changes
      if (field === 'startDate' || field === 'mentoringId') {
        const endDate = calculateEndDate(
          field === 'startDate' ? value : updated.startDate,
          field === 'mentoringId' ? value : updated.mentoringId
        );
        updated.endDate = endDate;
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.mentoringId || !formData.startDate || !formData.responsibleMentor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedMentoring = catalogs.find(c => c.id === formData.mentoringId);
      if (!selectedMentoring) {
        toast({
          title: "Erro",
          description: "Mentoria selecionada não encontrada",
          variant: "destructive",
        });
        return;
      }

      await createEnrollment({
        studentId: formData.studentId,
        mentoringId: formData.mentoringId,
        status: formData.status,
        enrollmentDate: formData.enrollmentDate,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalSessions: selectedMentoring.numberOfSessions,
        responsibleMentor: formData.responsibleMentor,
        paymentStatus: formData.paymentStatus,
        observations: formData.observations || undefined
      });

      // Reset form
      setFormData({
        studentId: '',
        mentoringId: '',
        status: 'ativa',
        enrollmentDate: new Date().toISOString().split('T')[0],
        startDate: '',
        endDate: '',
        responsibleMentor: '',
        paymentStatus: 'pendente',
        observations: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating enrollment:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Inscrição Individual</CardTitle>
        <CardDescription>
          Crie uma nova inscrição para mentoria individual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentId">ID do Estudante *</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="UUID do estudante"
                required
              />
            </div>
            <div>
              <Label htmlFor="mentoringId">Mentoria *</Label>
              <Select
                value={formData.mentoringId}
                onValueChange={(value) => handleInputChange('mentoringId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma mentoria" />
                </SelectTrigger>
                <SelectContent>
                  {catalogs.map((mentoring) => (
                    <SelectItem key={mentoring.id} value={mentoring.id}>
                      {mentoring.name} ({mentoring.numberOfSessions} sessões)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentStatus">Status do Pagamento</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleInputChange('paymentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="enrollmentDate">Data de Inscrição</Label>
              <Input
                id="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => handleInputChange('enrollmentDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data de Término</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="responsibleMentor">Mentor Responsável *</Label>
            <Input
              id="responsibleMentor"
              value={formData.responsibleMentor}
              onChange={(e) => handleInputChange('responsibleMentor', e.target.value)}
              placeholder="Nome do mentor responsável"
              required
            />
          </div>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              placeholder="Observações sobre a inscrição..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Inscrição'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentForm;
