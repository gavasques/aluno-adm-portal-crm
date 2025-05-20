
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { MoreVertical, User } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Comment {
  id: number;
  text: string;
  date: string;
  author: string;
}

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  column: string;
  responsible: string;
  lastContact: string;
  comments: Comment[];
}

interface SortableLeadCardProps {
  lead: Lead;
  openLeadDetails: (lead: Lead) => void;
}

const SortableLeadCard = ({ lead, openLeadDetails }: SortableLeadCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `lead-${lead.id}`,
    data: {
      type: 'lead',
      lead
    }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
      <Card className="cursor-pointer hover:shadow-md" onClick={() => openLeadDetails(lead)}>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-base">{lead.name}</h4>
              <p className="text-sm text-gray-600">{lead.company}</p>
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-48">
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Responsável:</span> {lead.responsible}</p>
                  <p><span className="font-medium">Último contato:</span> {lead.lastContact}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {lead.responsible}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortableLeadCard;
