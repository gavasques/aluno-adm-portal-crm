
import { CardStats } from "@/components/ui/card-stats";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Book, ListChecks, User, Calendar, FileText, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-6">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* CRM Overview */}
        <Card className="lg:col-span-2 border-t-4 border-t-portal-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
              {[
                {stage: "Lead In", count: 12, color: "bg-blue-100"},
                {stage: "Apresentação", count: 8, color: "bg-indigo-100"},
                {stage: "Reunião", count: 5, color: "bg-purple-100"},
                {stage: "Acompanhamento", count: 4, color: "bg-pink-100"},
                {stage: "Fechado", count: 7, color: "bg-green-100"}
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-full h-32 ${item.color} rounded-lg mb-2 flex items-center justify-center relative`}>
                    <span className="text-2xl font-bold">{item.count}</span>
                    {i === 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-blue-500">Novo</Badge>
                    )}
                  </div>
                  <span className="text-sm font-medium">{item.stage}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-sm text-gray-500">36 leads ativos no total</p>
            <Link to="/admin/crm" className="text-portal-primary text-sm font-medium ml-auto">
              Gerenciar leads →
            </Link>
          </CardFooter>
        </Card>
        
        {/* Recent Students */}
        <Card className="border-t-4 border-t-amber-400">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Alunos Recentes</CardTitle>
              <Badge className="bg-amber-400">4 novos</Badge>
            </div>
            <CardDescription>Últimos alunos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {name: "Ana Silva", days: 1, active: true},
                {name: "Carlos Oliveira", days: 2, active: true},
                {name: "Mariana Costa", days: 3, active: true},
                {name: "Pedro Santos", days: 4, active: false}
              ].map((student, i) => (
                <div key={i} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-portal-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium">{student.name}</p>
                      {student.active && (
                        <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{`Registrado há ${student.days} dia${student.days > 1 ? 's' : ''}`}</p>
                  </div>
                  <Button variant="ghost" size="sm">Ver</Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link to="/admin/students" className="w-full">
              <Button variant="outline" className="w-full">Ver Todos os Alunos</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Mentoring Sessions */}
        <Card className="lg:col-span-2 border-t-4 border-t-green-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Próximas Mentorias</CardTitle>
              <Badge className="bg-green-500">Hoje</Badge>
            </div>
            <CardDescription>Mentorias agendadas para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  student: "Ana Silva",
                  date: "Hoje, 14:00",
                  type: "Individual",
                  status: "Confirmada",
                  isToday: true
                },
                {
                  student: "Grupo Iniciantes",
                  date: "Amanhã, 10:00",
                  type: "Grupo (8 alunos)",
                  status: "Confirmada",
                  isToday: false
                },
                {
                  student: "Carlos Oliveira",
                  date: "25/05, 16:30",
                  type: "Individual",
                  status: "Aguardando confirmação",
                  isToday: false
                }
              ].map((session, i) => (
                <Card key={i} className={`border ${session.isToday ? 'border-green-200 bg-green-50' : 'border-border'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${session.isToday ? 'bg-green-100' : 'bg-portal-light'} flex items-center justify-center mr-3`}>
                          {session.type === "Grupo (8 alunos)" ? 
                            <Users className={`h-5 w-5 ${session.isToday ? 'text-green-600' : 'text-portal-primary'}`} /> : 
                            <User className={`h-5 w-5 ${session.isToday ? 'text-green-600' : 'text-portal-primary'}`} />}
                        </div>
                        <div>
                          <p className="font-medium">{session.student}</p>
                          <p className="text-sm text-gray-500">{session.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Calendar className={`h-4 w-4 mr-1 ${session.isToday ? 'text-green-600' : 'text-portal-primary'}`} />
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
          <CardFooter className="border-t pt-4">
            <Link to="/admin/mentoring" className="w-full">
              <Button variant="outline" className="w-full">Ver Todas as Mentorias</Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Upcoming Tasks */}
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
