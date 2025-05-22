
import { GridBackground } from "@/components/ui/grid-background";

export const LoadingToken: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="mb-12">
          <img src="/lovable-uploads/788ca39b-e116-44df-95de-2048b2ed6a09.png" alt="Logo" className="h-12" />
        </div>
        <div className="w-full max-w-md mx-auto p-8 space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-white">Verificando link de recuperação...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
