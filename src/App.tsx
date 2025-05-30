
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AdminLayout from '@/layout/AdminLayout';
import LeadDetails from '@/pages/admin/LeadDetails';
import CRM from '@/pages/admin/CRM';
import Index from '@/pages/Index';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <HelmetProvider>
        <Helmet>
          <title>Portal LV - Educação Avançada</title>
          <meta name="description" content="Portal educacional completo com cursos, mentorias e recursos para crescimento profissional." />
        </Helmet>
        <BrowserRouter>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Index />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="crm" element={<CRM />} />
              <Route path="crm/lead/:id" element={<LeadDetails />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
