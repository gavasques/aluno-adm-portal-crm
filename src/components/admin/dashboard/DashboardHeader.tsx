
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-portal-dark">Dashboard do Administrador</h1>
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <Button variant="outline" className="flex items-center gap-2">
          <FileText size={16} />
          Exportar Relatórios
        </Button>
        <Button className="flex items-center gap-2">
          <MessageSquare size={16} />
          Nova Mensagem
        </Button>
      </div>
    </div>
  );
}
