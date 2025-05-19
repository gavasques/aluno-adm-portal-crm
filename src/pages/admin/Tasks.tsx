
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tasks = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Lista de Tarefas</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Conteúdo da página de tarefas em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
