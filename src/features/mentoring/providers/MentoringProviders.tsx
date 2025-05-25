
import React, { ReactNode } from 'react';
import { MentoringProvider } from '../contexts/MentoringContext';
import { MentoringQueryProvider } from './QueryProvider';
import { MentoringErrorBoundary } from '../shared/components/ErrorBoundary';

interface MentoringProvidersProps {
  children: ReactNode;
}

export const MentoringProviders: React.FC<MentoringProvidersProps> = ({ children }) => {
  return (
    <MentoringErrorBoundary>
      <MentoringQueryProvider>
        <MentoringProvider>
          {children}
        </MentoringProvider>
      </MentoringQueryProvider>
    </MentoringErrorBoundary>
  );
};
