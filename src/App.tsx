
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppErrorBoundary } from '@/components/app/AppErrorBoundary';
import { AppProviders } from '@/components/app/AppProviders';
import AppRoutes from '@/components/app/AppRoutes';
import { BlockingDetectionBanner } from '@/components/BlockingDetectionBanner';
import { useAppInitialization } from '@/hooks/app/useAppInitialization';

function App() {
  console.log('🚀 App: Iniciando aplicação...');
  
  useAppInitialization();

  return (
    <AppErrorBoundary>
      <AppProviders>
        <Router>
          <div className="App">
            <BlockingDetectionBanner />
            <AppRoutes />
          </div>
        </Router>
      </AppProviders>
    </AppErrorBoundary>
  );
}

export default App;
