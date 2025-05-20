
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export function RecentStudents() {
  return (
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
  );
}
