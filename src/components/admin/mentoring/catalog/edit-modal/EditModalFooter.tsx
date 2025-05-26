
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface EditModalFooterProps {
  onSave: () => void;
  onClose: () => void;
}

const EditModalFooter: React.FC<EditModalFooterProps> = ({ onSave, onClose }) => {
  return (
    <DialogFooter className="pt-6 border-t border-gray-100 mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-lg -mx-6 px-6 pb-6">
      <div className="flex gap-3 w-full justify-end">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 h-10 px-4 text-sm transition-all duration-200 hover:shadow-sm"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button 
          onClick={onSave}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 h-10 px-4 text-sm"
        >
          <Save className="h-4 w-4 mr-2" />
          💾 Salvar Alterações
        </Button>
      </div>
    </DialogFooter>
  );
};

export default EditModalFooter;
