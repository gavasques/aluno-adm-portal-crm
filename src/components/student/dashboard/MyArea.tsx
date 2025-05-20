
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

export function MyArea() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-portal-dark mb-4">Minha Área</h2>
      
      {/* My Suppliers */}
      <Card className="border-t-4 border-t-green-400">
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
    </div>
  );
}
