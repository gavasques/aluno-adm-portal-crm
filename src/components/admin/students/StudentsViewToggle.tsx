
import React from "react";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

interface StudentsViewToggleProps {
  viewMode: "cards" | "list";
  onViewModeChange: (mode: "cards" | "list") => void;
}

export const StudentsViewToggle: React.FC<StudentsViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1 bg-gray-50">
      <Button
        variant={viewMode === "cards" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("cards")}
        className="h-8 px-3"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className="h-8 px-3"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
