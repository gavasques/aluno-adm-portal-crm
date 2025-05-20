
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoveHorizontal } from "lucide-react";

interface Column {
  id: string;
  name: string;
  color: string;
}

interface SortableColumnProps {
  column: Column;
  children: React.ReactNode;
  leadCount: number;
}

const SortableColumn = ({ column, children, leadCount }: SortableColumnProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1
  };
  
  return (
    <div ref={setNodeRef} style={style} className="flex flex-col">
      <div className={`px-3 py-2 rounded-t-md ${column.color} border-b`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MoveHorizontal className="h-4 w-4 mr-2 cursor-grab" {...attributes} {...listeners} />
            <h3 className="font-medium">{column.name}</h3>
          </div>
          <span className="text-sm bg-white px-2 py-1 rounded-full">
            {leadCount}
          </span>
        </div>
      </div>
      
      <div className={`flex-1 p-2 bg-gray-50 rounded-b-md border border-t-0 min-h-[500px]`}>
        {children}
      </div>
    </div>
  );
};

export default SortableColumn;
