
import React from 'react';
import { Button } from '@/components/ui/button';

interface IndividualEnrollmentsEmptyProps {
  onAddEnrollment: () => void;
}

export const IndividualEnrollmentsEmpty = ({ onAddEnrollment }: IndividualEnrollmentsEmptyProps) => {
  return (
    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma inscrição individual</h3>
        <p className="text-gray-600 text-sm mb-6">Comece criando a primeira inscrição individual de mentoria.</p>
        <Button
          onClick={onAddEnrollment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Criar Primeira Inscrição
        </Button>
      </div>
    </div>
  );
};
