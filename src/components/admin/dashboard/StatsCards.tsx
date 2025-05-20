
import { Users, Book, ListChecks } from "lucide-react";
import { CardStats } from "@/components/ui/card-stats";

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <CardStats 
        title="Usuários Ativos"
        value="125"
        icon={<Users size={20} />}
        description="último mês"
        trend="up"
        trendValue="12%"
        className="bg-gradient-to-br from-portal-light/30 to-white"
      />
      
      <CardStats 
        title="Fornecedores"
        value="48"
        icon={<Users size={20} />}
        description="cadastrados"
        className="bg-gradient-to-br from-blue-50 to-white"
      />
      
      <CardStats 
        title="Mentorias"
        value="26"
        icon={<Book size={20} />}
        description="agendadas para este mês"
        trend="up"
        trendValue="8"
        className="bg-gradient-to-br from-green-50 to-white"
      />
      
      <CardStats 
        title="Tarefas"
        value="15"
        icon={<ListChecks size={20} />}
        description="pendentes"
        trend="down"
        trendValue="3"
        className="bg-gradient-to-br from-amber-50 to-white"
      />
    </div>
  );
}
