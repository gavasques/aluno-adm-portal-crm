
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-br from-portal-primary to-portal-secondary text-white">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Portal do Aluno e Administração
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Uma plataforma completa com fornecedores, parceiros e ferramentas para impulsionar seu e-commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/student">
              <Button size="lg" className="bg-white text-portal-primary hover:bg-portal-light">
                Área do Aluno
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Área do Administrador
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-portal-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-portal-dark">
            Características do Portal
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="portal-card flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-portal-light flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-portal-primary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-portal-dark">Gestão de Fornecedores</h3>
              <p className="text-gray-600 mb-4">
                Gerencie seus fornecedores com um micro CRM completo, incluindo contatos, filiais, marcas e avaliações.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="portal-card flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-portal-light flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-portal-primary">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-portal-dark">Mentorias e Cursos</h3>
              <p className="text-gray-600 mb-4">
                Organize e acompanhe cursos e mentorias com controle de agenda, participantes e status de cada sessão.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="portal-card flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-portal-light flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-portal-primary">
                  <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12z"></path>
                  <path d="M9 22h6"></path>
                  <path d="M9 6h.01"></path>
                  <path d="M9 10h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-portal-dark">CRM para Gestão de Leads</h3>
              <p className="text-gray-600 mb-4">
                Acompanhe seus leads em um sistema estilo Kanban com personalização de colunas e fluxos de vendas.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-portal-dark">
            Pronto para começar?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Acesse agora mesmo nossa plataforma e descubra as melhores ferramentas e fornecedores para seu e-commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/student">
              <Button size="lg" className="bg-portal-primary text-white hover:bg-portal-dark">
                Área do Aluno
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="text-portal-primary border-portal-primary hover:bg-portal-light">
                Área do Administrador
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
