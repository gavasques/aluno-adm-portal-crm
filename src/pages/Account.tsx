
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth";

const Account = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Minha Conta</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Nome:</strong> {user?.user_metadata?.name || "Não definido"}</p>
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Último login:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Nunca"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
