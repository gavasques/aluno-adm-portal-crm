
import { Button } from "@/components/ui/button";
import { Bell, FileText, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-portal-dark">Dashboard do Aluno</h1>
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <Button variant="outline" className="flex items-center gap-2">
          <Search size={16} />
          Pesquisar Conteúdo
        </Button>
        <Button variant="outline" className="flex items-center gap-2 relative">
          <Bell size={16} />
          Notificações
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
        </Button>
        <Button className="flex items-center gap-2">
          <FileText size={16} />
          Meus Arquivos
        </Button>
      </div>
    </div>
  );
}
