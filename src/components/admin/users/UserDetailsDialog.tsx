
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Mail, CalendarClock, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    tasks?: any[];
  } | null;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  user 
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" /> 
            Detalhes do Usuário
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o usuário selecionado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarClock className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Último Login</p>
                    <p className="font-medium">{user.lastLogin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Status e Permissões</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Papel</p>
                    <Badge
                      variant={user.role === "Admin" ? "default" : "outline"}
                      className={
                        user.role === "Admin"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge
                      variant={user.status === "Ativo" ? "default" : "outline"}
                      className={
                        user.status === "Ativo"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
