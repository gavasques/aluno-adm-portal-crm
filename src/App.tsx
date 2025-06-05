import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster as SonnerToaster } from 'sonner';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLayout from './layout/AdminLayout';
import StudentLayout from './layout/StudentLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsuarios from './pages/admin/Usuarios';
import AdminCRM from './pages/admin/CRM';
import CrmWebhookLogs from './pages/admin/CrmWebhookLogs';
import AdminTarefas from './pages/admin/Tarefas';
import AdminAlunos from './pages/admin/Alunos';
import AdminCursos from './pages/admin/Cursos';
import AdminMentoria from './pages/admin/Mentoria';
import AdminBonus from './pages/admin/Bonus';
import AdminCreditos from './pages/admin/Creditos';
import AdminNoticias from './pages/admin/Noticias';
import AdminFornecedores from './pages/admin/Fornecedores';
import AdminParceiros from './pages/admin/Parceiros';
import AdminFerramentas from './pages/admin/Ferramentas';
import AdminCategorias from './pages/admin/Categorias';
import AdminTiposSoftwares from './pages/admin/TiposSoftwares';
import AdminTiposParceiros from './pages/admin/TiposParceiros';
import AdminPermissoes from './pages/admin/Permissoes';
import AdminAuditoria from './pages/admin/Auditoria';
import AdminCalendlyConfig from './pages/admin/CalendlyConfig';
import AdminConfiguracoes from './pages/admin/Configuracoes';
import ApiDocumentation from './pages/admin/ApiDocumentation';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCursos from './pages/student/Cursos';
import StudentMentores from './pages/student/Mentores';
import StudentComunidade from './pages/student/Comunidade';
import StudentTarefas from './pages/student/Tarefas';
import StudentConfiguracoes from './pages/student/Configuracoes';
import StudentLayoutPage from './layout/StudentLayoutPage';
import StudentTrilha from './pages/student/Trilha';
import StudentCronograma from './pages/student/Cronograma';
import StudentSessoes from './pages/student/Sessoes';
import StudentSessoesIndividuais from './pages/student/SessoesIndividuais';
import StudentSessoesEmGrupo from './pages/student/SessoesEmGrupo';
import StudentInscricoesIndividuais from './pages/student/InscricoesIndividuais';
import StudentInscricoesEmGrupo from './pages/student/InscricoesEmGrupo';
import StudentMentoriaCatalogo from './pages/student/MentoriaCatalogo';
import StudentMentoriaMateriais from './pages/student/MentoriaMateriais';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="crm" element={<AdminCRM />} />
              <Route path="crm-webhook-logs" element={<CrmWebhookLogs />} />
              <Route path="tarefas" element={<AdminTarefas />} />
              <Route path="alunos" element={<AdminAlunos />} />
              <Route path="cursos" element={<AdminCursos />} />
              <Route path="mentoria" element={<AdminMentoria />} />
              <Route path="bonus" element={<AdminBonus />} />
              <Route path="creditos" element={<AdminCreditos />} />
              <Route path="noticias" element={<AdminNoticias />} />
              <Route path="fornecedores" element={<AdminFornecedores />} />
              <Route path="parceiros" element={<AdminParceiros />} />
              <Route path="ferramentas" element={<AdminFerramentas />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="tipos-softwares" element={<AdminTiposSoftwares />} />
              <Route path="tipos-parceiros" element={<AdminTiposParceiros />} />
              <Route path="permissoes" element={<AdminPermissoes />} />
              <Route path="auditoria" element={<AdminAuditoria />} />
              <Route path="calendly-config" element={<AdminCalendlyConfig />} />
              <Route path="configuracoes" element={<AdminConfiguracoes />} />
              <Route path="api-docs" element={<ApiDocumentation />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="cursos" element={<StudentCursos />} />
              <Route path="mentores" element={<StudentMentores />} />
              <Route path="comunidade" element={<StudentComunidade />} />
              <Route path="tarefas" element={<StudentTarefas />} />
              <Route path="configuracoes" element={<StudentConfiguracoes />} />
            </Route>

            <Route path="/student-page" element={<StudentLayoutPage />}>
              <Route path="trilha" element={<StudentTrilha />} />
              <Route path="cronograma" element={<StudentCronograma />} />
              <Route path="sessoes" element={<StudentSessoes />} />
              <Route path="sessoes-individuais" element={<StudentSessoesIndividuais />} />
              <Route path="sessoes-grupo" element={<StudentSessoesEmGrupo />} />
              <Route path="inscricoes-individuais" element={<StudentInscricoesIndividuais />} />
              <Route path="inscricoes-grupo" element={<StudentInscricoesEmGrupo />} />
              <Route path="mentoria-catalogo" element={<StudentMentoriaCatalogo />} />
              <Route path="mentoria-materiais" element={<StudentMentoriaMateriais />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
