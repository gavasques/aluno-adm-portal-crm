
/**
 * Obtém a URL do webhook configurada pelo admin
 * @returns URL do webhook configurada ou URL padrão
 */
export const getWebhookUrl = (): string => {
  const savedUrl = localStorage.getItem('admin_webhook_config');
  return savedUrl || 'https://n8n.guilhermevasques.club/webhook/mensagem';
};

/**
 * Define a URL do webhook
 * @param url Nova URL do webhook
 */
export const setWebhookUrl = (url: string): void => {
  localStorage.setItem('admin_webhook_config', url);
};

/**
 * Valida se uma URL é válida
 * @param url URL para validar
 * @returns true se a URL for válida
 */
export const isValidWebhookUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
