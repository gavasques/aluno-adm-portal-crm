
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface StudentsActionsProps {
  onExportCSV: () => void;
}

export const StudentsActions = ({ onExportCSV }: StudentsActionsProps) => {
  return (
    <Button onClick={onExportCSV}>
      <Download className="mr-2 h-4 w-4" /> Exportar CSV
    </Button>
  );
};
