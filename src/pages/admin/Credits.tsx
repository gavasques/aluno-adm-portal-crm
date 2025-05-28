
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditsDashboard from "@/components/admin/credits/CreditsDashboard";
import CreditsReports from "@/components/admin/credits/CreditsReports";
import CreditsSettings from "@/components/admin/credits/CreditsSettings";

const Credits = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Créditos</h1>
        <p className="text-gray-600 mt-1">
          Controle e monitore o sistema de créditos
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <CreditsDashboard />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <CreditsReports />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <CreditsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Credits;
