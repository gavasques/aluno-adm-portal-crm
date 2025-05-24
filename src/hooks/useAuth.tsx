
import { useAuth as useAuthHook, AuthProvider, recoveryModeUtils } from "./auth";

// Re-exportar apenas as funções e componentes necessários
export { AuthProvider, recoveryModeUtils };
export const useAuth = useAuthHook;
