
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CRM = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">CRM / Gestão de Leads</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Conteúdo da página de CRM e gestão de leads em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRM;
