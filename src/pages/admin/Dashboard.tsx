
import { CardStats } from "@/components/ui/card-stats";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Book, ListChecks, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Dashboard do Administrador</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardStats 
          title="Usuários Ativos"
          value="125"
          icon={<Users size={20} />}
          description="último mês"
          trend="up"
          trendValue="12%"
        />
        
        <CardStats 
          title="Fornecedores"
          value="48"
          icon={<Users size={20} />}
          description="cadastrados"
        />
        
        <CardStats 
          title="Mentorias"
          value="26"
          icon={<Book size={20} />}
          description="agendadas para este mês"
          trend="up"
          trendValue="8"
        />
        
        <CardStats 
          title="Tarefas"
          value="15"
          icon={<ListChecks size={20} />}
          description="pendentes"
          trend="down"
          trendValue="3"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* CRM Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Visão Geral do CRM</CardTitle>
              <CardDescription>Status dos leads por etapa</CardDescription>
            </div>
            <Link to="/admin/crm">
              <Button variant="outline">Ver Completo</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 text-center">
              {["Lead In", "Apresentação", "Reunião", "Acompanhamento", "Fechado"].map((stage, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {i === 0 ? 12 : i === 1 ? 8 : i === 2 ? 5 : i === 3 ? 4 : 7}
                    </span>
                  </div>
                  <span className="text-sm">{stage}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">36 leads ativos no total</p>
          </CardFooter>
        </Card>
        
        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle>Alunos Recentes</CardTitle>
            <CardDescription>Últimos alunos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Ana Silva", "Carlos Oliveira", "Mariana Costa", "Pedro Santos"].map((name, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-portal-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-500">{`Registrado há ${i + 1} dia${i > 0 ? 's' : ''}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/students" className="w-full">
              <Button variant="outline" className="w-full">Ver Todos os Alunos</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Mentoring Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Próximas Mentorias</CardTitle>
            <CardDescription>Mentorias agendadas para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  student: "Ana Silva",
                  date: "Hoje, 14:00",
                  type: "Individual",
                  status: "Confirmada"
                },
                {
                  student: "Grupo Iniciantes",
                  date: "Amanhã, 10:00",
                  type: "Grupo (8 alunos)",
                  status: "Confirmada"
                },
                {
                  student: "Carlos Oliveira",
                  date: "25/05, 16:30",
                  type: "Individual",
                  status: "Aguardando confirmação"
                }
              ].map((session, i) => (
                <Card key={i} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center mr-3">
                          {session.type === "Grupo (8 alunos)" ? 
                            <Users className="h-5 w-5 text-portal-primary" /> : 
                            <User className="h-5 w-5 text-portal-primary" />}
                        </div>
                        <div>
                          <p className="font-medium">{session.student}</p>
                          <p className="text-sm text-gray-500">{session.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-portal-primary" />
                          <p className="font-medium">{session.date}</p>
                        </div>
                        <p className={`text-sm ${session.status === "Confirmada" ? "text-green-500" : "text-amber-500"}`}>
                          {session.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/mentoring" className="w-full">
              <Button variant="outline" className="w-full">Ver Todas as Mentorias</Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Tarefas</CardTitle>
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
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === "Alta" ? "bg-red-500" :
                      task.priority === "Média" ? "bg-amber-500" : "bg-green-500"
                    } mr-3`}></div>
                    <p className="font-medium">{task.title}</p>
                  </div>
                  <p className="text-sm text-gray-500">{task.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/tasks" className="w-full">
              <Button variant="outline" className="w-full">Ver Todas as Tarefas</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
