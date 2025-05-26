
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Plus, Search } from 'lucide-react';

interface EnrollmentsEmptyStateProps {
  hasFilters: boolean;
  onAddEnrollment: () => void;
  onClearFilters: () => void;
}

export const EnrollmentsEmptyState: React.FC<EnrollmentsEmptyStateProps> = ({
  hasFilters,
  onAddEnrollment,
  onClearFilters
}) => {
  if (hasFilters) {
    return (
      <Card className="border-2 border-dashed border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-3 bg-gray-100 rounded-full mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Não foram encontradas inscrições que correspondam aos filtros aplicados.
            Tente ajustar os critérios de busca.
          </p>
          <Button onClick={onClearFilters} variant="outline">
            Limpar Filtros
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-3 bg-blue-100 rounded-full mb-4">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma inscrição cadastrada
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          Comece criando a primeira inscrição de mentoria para um aluno.
          Você pode gerenciar todas as inscrições e acompanhar o progresso dos estudantes.
        </p>
        <Button onClick={onAddEnrollment}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Primeira Inscrição
        </Button>
      </CardContent>
    </Card>
  );
};
