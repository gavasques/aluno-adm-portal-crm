
import { corsHeaders } from './utils.ts';

/**
 * Cria uma resposta HTTP de sucesso
 */
export function createSuccessResponse(data: any, status: number = 200): Response {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
      status: status
    }
  );
}

/**
 * Cria uma resposta HTTP de erro
 */
export function createErrorResponse(error: any, status: number = 500): Response {
  const errorMessage = error?.message || (typeof error === 'string' ? error : "Erro desconhecido");
  
  return new Response(
    JSON.stringify({ error: errorMessage }),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
      status: status
    }
  );
}
