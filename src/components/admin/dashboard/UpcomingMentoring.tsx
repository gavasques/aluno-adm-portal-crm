
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export function UpcomingMentoring() {
  return (
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
  );
}
