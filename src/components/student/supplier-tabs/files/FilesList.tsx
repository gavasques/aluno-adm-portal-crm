
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileItem from "./FileItem";
import { CustomFile } from "./utils";

interface FilesListProps {
  files: CustomFile[];
  onDeleteFile?: (id: number) => void;
  isEditing?: boolean;
}

const FilesList: React.FC<FilesListProps> = ({ 
  files, 
  onDeleteFile,
  isEditing = true
}) => {
  if (files.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        Nenhum arquivo cadastrado.
      </p>
    );
  }
  
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {files.map((file) => (
          <FileItem 
            key={file.id} 
            id={file.id}
            name={file.name}
            type={file.type}
            size={file.size}
            date={file.date}
            onDelete={onDeleteFile}
            isEditing={isEditing}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default FilesList;
