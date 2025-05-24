
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useSignInOut } from "@/hooks/auth/useBasicAuth/useSignInOut";

const TopBar = () => {
  const { user } = useAuth();
  const { signOut } = useSignInOut();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="lg:hidden" />
          <div className="font-semibold text-lg text-portal-dark">
            Portal do Aluno
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
