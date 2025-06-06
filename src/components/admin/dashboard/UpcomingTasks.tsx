
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

export function UpcomingTasks() {
  return (
    <Card className="border-t-4 border-t-red-400">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Próximas Tarefas</CardTitle>
          <Badge className="bg-red-400">4 pendentes</Badge>
        </div>
        <CardDescription>Tarefas agendadas para hoje</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              title: "Reunião com fornecedor",
              time: "11:00",
              priority: "Alta"
            },
            {
              title: "Revisar propostas",
              time: "14:30",
              priority: "Média"
            },
            {
              title: "Call com parceiro",
              time: "16:00",
              priority: "Alta"
            },
            {
              title: "Preparar material",
              time: "17:30",
              priority: "Baixa"
            }
          ].map((task, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${
                  task.priority === "Alta" ? "bg-red-500" :
                  task.priority === "Média" ? "bg-amber-500" : "bg-green-500"
                } mr-3`}></div>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-gray-500">Prioridade: {task.priority}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{task.time}</p>
                <Button variant="ghost" size="sm">
                  <ListChecks size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Link to="/admin/tarefas" className="w-full">
          <Button variant="outline" className="w-full">Ver Todas as Tarefas</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
