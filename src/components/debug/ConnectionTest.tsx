
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testando...");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log("Testando conexão com Supabase...");
      setConnectionStatus("Testando conexão...");
      setError("");
      
      // Verificar se o cliente Supabase foi inicializado
      if (!supabase) {
        throw new Error("Cliente Supabase não inicializado");
      }

      console.log("Cliente Supabase inicializado com sucesso");

      // Fazer uma consulta simples para testar a conectividade
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (queryError) {
        console.error("Erro na consulta:", queryError);
        setError(`Erro na consulta: ${queryError.message}`);
        setConnectionStatus("Erro na conexão");
      } else {
        console.log("Conexão bem-sucedida!", data);
        setConnectionStatus("Conexão OK");
      }
    } catch (err: any) {
      console.error("Erro no teste de conexão:", err);
      setError(err.message || "Erro desconhecido");
      setConnectionStatus("Falha na conexão");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Teste de Conexão Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Status:</strong> 
          <span className={`ml-2 ${
            connectionStatus === "Conexão OK" ? "text-green-600" : 
            connectionStatus === "Falha na conexão" || connectionStatus === "Erro na conexão" ? "text-red-600" : 
            "text-yellow-600"
          }`}>
            {connectionStatus}
          </span>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            <strong>Erro:</strong> {error}
          </div>
        )}
        
        <Button onClick={testConnection} className="w-full">
          Testar Novamente
        </Button>
      </CardContent>
    </Card>
  );
};
