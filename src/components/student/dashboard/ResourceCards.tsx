import { CardStats } from "@/components/ui/card-stats";
import { Users, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ResourceCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-green-500"
        onClick={() => navigate('/aluno/creditos')}
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Meus Créditos</h3>
              <p className="text-sm text-gray-600">Gerencie seus créditos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <CardStats 
        title="Fornecedores"
        value="24"
        icon={<Users size={20} />}
        description="disponíveis para você"
        trend="up"
        trendValue="3"
        onClick={() => navigate('/aluno/fornecedores')}
        className="bg-gradient-to-br from-blue-50 to-white border-t-4 border-t-blue-400"
      />
      
      <CardStats 
        title="Parceiros"
        value="12"
        icon={<Users size={20} />}
        description="disponíveis para você"
        onClick={() => navigate('/aluno/parceiros')}
        className="bg-gradient-to-br from-purple-50 to-white border-t-4 border-t-purple-400"
      />
      
      <CardStats 
        title="Ferramentas"
        value="18"
        icon={<Book size={20} />}
        description="disponíveis para você"
        trend="up"
        trendValue="2"
        onClick={() => navigate('/aluno/ferramentas')}
        className="bg-gradient-to-br from-green-50 to-white border-t-4 border-t-green-400"
      />
    </div>
  );
};
