
import React from 'react';

interface KanbanLoadingOverlayProps {
  isVisible: boolean;
}

export const KanbanLoadingOverlay: React.FC<KanbanLoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Movendo lead...</span>
        </div>
      </div>
    </div>
  );
};
