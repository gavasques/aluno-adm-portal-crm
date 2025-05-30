
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AdminLayout from '@/layout/AdminLayout';
import LeadDetails from '@/pages/admin/LeadDetails';
import CRM from '@/pages/admin/CRM';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

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
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="crm" element={<CRM />} />
              <Route path="crm/lead/:id" element={<LeadDetails />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
