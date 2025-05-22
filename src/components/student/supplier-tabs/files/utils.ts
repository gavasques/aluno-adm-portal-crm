
// Função para converter tamanho string para bytes
export const stringToBytes = (sizeStr: string): number => {
  const size = parseFloat(sizeStr);
  if (sizeStr.includes("KB")) return size * 1024;
  if (sizeStr.includes("MB")) return size * 1024 * 1024;
  if (sizeStr.includes("GB")) return size * 1024 * 1024 * 1024;
  return size;
};

// Função para formatar bytes para string legível
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Total de armazenamento disponível em bytes (100MB)
export const STORAGE_LIMIT = 100 * 1024 * 1024;

// Interface para o tipo de arquivo personalizado
export interface CustomFile {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
}
