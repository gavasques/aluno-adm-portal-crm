import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import SortableColumn from "./SortableColumn";
import SortableLeadCard from "./SortableLeadCard";
import { Lead, Column } from "@/hooks/useCRMState";

interface KanbanViewProps {
  columns: Column[];
  filteredLeads: Lead[];
  onDragEnd: (event: DragEndEvent) => void;
  openLeadDetails: (lead: Lead) => void;
}

const KanbanView = ({ columns, filteredLeads, onDragEnd, openLeadDetails }: KanbanViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Configure DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <div className="p-4">
        <div 
          ref={scrollContainerRef} 
          className="overflow-x-auto pb-4" 
          style={{ maxWidth: '100%' }}
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
              <SortableContext items={columns.map(col => col.id)}>
                {columns.map(column => {
                  const columnLeads = filteredLeads.filter(lead => lead.column === column.id);
                  return (
                    <div key={column.id} className="w-[280px]">
                      <SortableColumn column={column} leadCount={columnLeads.length}>
                        <SortableContext items={columnLeads.map(lead => `lead-${lead.id}`)}>
                          {columnLeads.map(lead => (
                            <SortableLeadCard 
                              key={lead.id} 
                              lead={lead} 
                              openLeadDetails={openLeadDetails} 
                            />
                          ))}
                        </SortableContext>
                      </SortableColumn>
                    </div>
                  );
                })}
              </SortableContext>
            </div>
          </DndContext>
        </div>
        <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white shadow-md" 
            onClick={handleScrollLeft}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white shadow-md" 
            onClick={handleScrollRight}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KanbanView;
