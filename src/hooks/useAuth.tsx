
import { useAuth as useAuthHook, AuthProvider } from "./auth";

// Re-exportar apenas as funções e componentes necessários
export { AuthProvider };
export const useAuth = useAuthHook;
