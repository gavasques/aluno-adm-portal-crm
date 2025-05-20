
import { CardStats } from "@/components/ui/card-stats";
import { Users, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ResourceCards() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <CardStats 
        title="Fornecedores"
        value="24"
        icon={<Users size={20} />}
        description="disponíveis para você"
        trend="up"
        trendValue="3"
        onClick={() => navigate('/student/suppliers')}
        className="bg-gradient-to-br from-blue-50 to-white border-t-4 border-t-blue-400"
      />
      
      <CardStats 
        title="Parceiros"
        value="12"
        icon={<Users size={20} />}
        description="disponíveis para você"
        onClick={() => navigate('/student/partners')}
        className="bg-gradient-to-br from-purple-50 to-white border-t-4 border-t-purple-400"
      />
      
      <CardStats 
        title="Ferramentas"
        value="18"
        icon={<Book size={20} />}
        description="disponíveis para você"
        trend="up"
        trendValue="2"
        onClick={() => navigate('/student/tools')}
        className="bg-gradient-to-br from-green-50 to-white border-t-4 border-t-green-400"
      />
    </div>
  );
}
