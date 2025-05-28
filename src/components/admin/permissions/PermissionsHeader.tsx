
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sync } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MenuSyncManager from "./MenuSyncManager";

interface PermissionsHeaderProps {
  onAdd: () => void;
}

const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({ onAdd }) => {
  const [showSyncDialog, setShowSyncDialog] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grupos de Permissão</h1>
          <p className="text-gray-600 mt-1">
            Gerencie grupos de permissões e controle de acesso
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowSyncDialog(true)}
            className="flex items-center gap-2"
          >
            <Sync className="h-4 w-4" />
            Sincronizar Menus
          </Button>
          <Button onClick={onAdd} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Grupo
          </Button>
        </div>
      </div>

      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sincronização de Menus</DialogTitle>
          </DialogHeader>
          <MenuSyncManager />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PermissionsHeader;
