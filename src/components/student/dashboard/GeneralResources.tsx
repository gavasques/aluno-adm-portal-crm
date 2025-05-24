
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function GeneralResources() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-portal-dark mb-4">Recursos Gerais</h2>
      
      {/* Fornecedores Section */}
      <Card className="border-t-4 border-t-blue-400">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fornecedores</CardTitle>
            <CardDescription>Lista de fornecedores disponíveis para consulta</CardDescription>
          </div>
          <Link to="/aluno/fornecedores">
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
      <Card className="border-t-4 border-t-purple-400">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Parceiros</CardTitle>
            <CardDescription>Parceiros estratégicos para seu negócio</CardDescription>
          </div>
          <Link to="/aluno/parceiros">
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
    </div>
  );
}
