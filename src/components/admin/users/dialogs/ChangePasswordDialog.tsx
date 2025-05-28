
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Loader2, Eye, EyeOff } from "lucide-react";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onConfirmChange: (newPassword: string) => Promise<boolean>;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  onConfirmChange,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const validatePasswords = () => {
    const newErrors: { password?: string; confirm?: string } = {};
    
    if (newPassword.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirm = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validatePasswords()) {
      return;
    }

    setIsChanging(true);
    
    try {
      const success = await onConfirmChange(newPassword);
      if (success) {
        onOpenChange(false);
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
      }
    } finally {
      setIsChanging(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle>Alterar Senha</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Defina uma nova senha para o usuário <strong>{userEmail}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                className={errors.password ? "border-red-300" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
              className={errors.confirm ? "border-red-300" : ""}
            />
            {errors.confirm && (
              <p className="text-sm text-red-600">{errors.confirm}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isChanging}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isChanging || !newPassword || !confirmPassword}
          >
            {isChanging && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Key className="mr-2 h-4 w-4" />
            Alterar Senha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
