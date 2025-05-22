
import { useState } from "react";
import { Provider } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LinkedIdentities() {
  const { user, linkIdentity, unlinkIdentity, getLinkedIdentities } = useAuth();
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState<string | null>(null);
  
  const linkedIdentities = getLinkedIdentities() || [];
  const hasEmailProvider = linkedIdentities.some(identity => identity.provider === "email");
  const hasGoogleProvider = linkedIdentities.some(identity => identity.provider === "google");
  
  const handleLinkGoogle = async () => {
    setIsLinking(true);
    try {
      await linkIdentity("google");
    } catch (error) {
      console.error("Erro ao vincular conta Google:", error);
    } finally {
      setIsLinking(false);
    }
  };
  
  const handleUnlinkProvider = async (provider: Provider, id: string) => {
    if (linkedIdentities.length <= 1) {
      return; // Impedir desvinculação da única identidade
    }
    
    setIsUnlinking(id);
    try {
      await unlinkIdentity(provider, id);
    } catch (error) {
      console.error("Erro ao desvincular conta:", error);
    } finally {
      setIsUnlinking(null);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contas Vinculadas</CardTitle>
        <CardDescription>
          Gerencie as contas e serviços vinculados ao seu perfil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {linkedIdentities.length > 0 ? (
          linkedIdentities.map((identity) => (
            <div key={identity.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="flex items-center">
                {identity.provider === "email" ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                    <span className="text-lg">@</span>
                  </div>
                ) : identity.provider === "google" ? (
                  <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-6 h-6 mr-3" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white mr-3">
                    <span className="text-lg">?</span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{identity.provider.charAt(0).toUpperCase() + identity.provider.slice(1)}</p>
                  <p className="text-sm text-slate-500">
                    {identity.provider === "email" ? user.email : `Conta ${identity.provider}`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnlinkProvider(identity.provider as Provider, identity.id)}
                disabled={isUnlinking === identity.id || linkedIdentities.length <= 1}
                className={linkedIdentities.length <= 1 ? "cursor-not-allowed opacity-50" : ""}
              >
                {isUnlinking === identity.id ? "Removendo..." : "Remover"}
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-slate-500">Nenhuma conta vinculada</p>
        )}
        
        {linkedIdentities.length <= 1 && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Você precisa manter pelo menos uma forma de login para acessar sua conta.
            </AlertDescription>
          </Alert>
        )}
        
        {!hasGoogleProvider && (
          <Button
            onClick={handleLinkGoogle}
            disabled={isLinking}
            className="w-full flex items-center justify-center bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 mt-2"
          >
            {isLinking ? (
              "Vinculando..."
            ) : (
              <>
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-4 h-4 mr-2" />
                Vincular conta Google
              </>
            )}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-sm text-slate-500">
        <p>
          A vinculação de contas permite que você faça login usando diferentes serviços.
        </p>
      </CardFooter>
    </Card>
  );
}
