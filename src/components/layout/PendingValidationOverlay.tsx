
import { motion } from "framer-motion";
import { Clock, LogOut, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignInOut } from "@/hooks/auth/useBasicAuth/useSignInOut";

const PendingValidationOverlay = () => {
  const { signOut } = useSignInOut();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-2xl p-8 mx-4 max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Conta em Validação
          </h2>
        </div>
        
        <p className="text-gray-600 leading-relaxed mb-6">
          Sua conta está sendo validada. Assim que a mesma for validada você receberá acesso às respectivas áreas do portal.
        </p>
        
        <div className="mb-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Este processo pode levar algumas horas. Você será notificado por email quando sua conta for liberada.
          </p>
        </div>

        <div className="mb-6 pt-4 border-t border-gray-200 space-y-3">
          <p className="text-sm text-gray-600">
            Dúvidas entre em contato: <span className="font-medium text-blue-600">contato@guilhermevasques.com</span>
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-600">
              Enquanto isso, veja meus vídeos no Youtube:
            </p>
            <a 
              href="https://www.youtube.com/@guilhermeavasques" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium text-sm"
            >
              <Youtube className="w-4 h-4" />
              @guilhermeavasques
            </a>
          </div>
        </div>

        <Button
          onClick={signOut}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PendingValidationOverlay;
