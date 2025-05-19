
import { CardStats } from "@/components/ui/card-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Book } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Dashboard do Aluno</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardStats 
          title="Fornecedores"
          value="24"
          icon={<Users size={20} />}
          description="disponíveis para você"
          onClick={() => window.location.href = '/student/suppliers'}
        />
        
        <CardStats 
          title="Parceiros"
          value="12"
          icon={<Users size={20} />}
          description="disponíveis para você"
          onClick={() => window.location.href = '/student/partners'}
        />
        
        <CardStats 
          title="Ferramentas"
          value="18"
          icon={<Book size={20} />}
          description="disponíveis para você"
          onClick={() => window.location.href = '/student/tools'}
        />
      </div>
      
      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="myarea">Minha Área</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <h2 className="text-2xl font-semibold text-portal-dark mb-4">Recursos Gerais</h2>
          
          {/* Fornecedores Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fornecedores</CardTitle>
                <CardDescription>Lista de fornecedores disponíveis para consulta</CardDescription>
              </div>
              <Link to="/student/suppliers">
                <Button>Ver Todos</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample Suppliers */}
                {[1, 2, 3].map((id) => (
                  <Card key={id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center">
                          <Users size={18} className="text-portal-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Fornecedor {id}</h3>
                          <p className="text-sm text-gray-500">Produtos diversos</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center text-sm">
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                          <span className="ml-1 text-gray-600">(4.0)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Parceiros Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Parceiros</CardTitle>
                <CardDescription>Parceiros estratégicos para seu negócio</CardDescription>
              </div>
              <Link to="/student/partners">
                <Button>Ver Todos</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample Partners */}
                {[1, 2].map((id) => (
                  <Card key={id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center">
                          <BookOpen size={18} className="text-portal-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Parceiro {id}</h3>
                          <p className="text-sm text-gray-500">Serviços de marketing</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center text-sm">
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                          <span className="ml-1 text-gray-600">(4.2)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="myarea" className="space-y-6">
          <h2 className="text-2xl font-semibold text-portal-dark mb-4">Minha Área</h2>
          
          {/* My Suppliers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meus Fornecedores</CardTitle>
                <CardDescription>Fornecedores que você cadastrou</CardDescription>
              </div>
              <Link to="/student/my-suppliers">
                <Button>Gerenciar</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1].map((id) => (
                  <Card key={id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center">
                          <Users size={18} className="text-portal-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Meu Fornecedor {id}</h3>
                          <p className="text-sm text-gray-500">Produtos importados</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Link to="/student/my-suppliers" className="block">
                  <Card className="hover:shadow-md transition-shadow border-dashed h-full">
                    <CardContent className="p-4 flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center mx-auto mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-portal-primary">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-portal-primary">Adicionar Fornecedor</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
