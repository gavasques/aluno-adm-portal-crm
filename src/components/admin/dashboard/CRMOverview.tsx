
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function CRMOverview() {
  return (
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
  );
}
