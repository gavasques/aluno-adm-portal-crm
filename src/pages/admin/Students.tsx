
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Students = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Gestão de Alunos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Conteúdo da página de gestão de alunos em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
