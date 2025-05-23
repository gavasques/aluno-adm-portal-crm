
// Auxiliares para criação de respostas padronizadas

import { corsHeaders } from "./utils.ts";

// Cria uma resposta de sucesso padronizada
export function createSuccessResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status
    }
  );
}

// Cria uma resposta de erro padronizada
export function createErrorResponse(error: any, status = 500) {
  console.error("Erro na operação:", error);
  
  const errorMessage = error instanceof Error ? error.message : 
    (typeof error === 'string' ? error : "Erro desconhecido");
  
  return new Response(
    JSON.stringify({ error: errorMessage }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status
    }
  );
}
