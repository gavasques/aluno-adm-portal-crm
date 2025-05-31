
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Mail, Phone } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { motion } from 'framer-motion';

interface LeadDetailHeaderProps {
  lead: CRMLead;
  onClose: () => void;
}

export const LeadDetailHeader = ({ lead, onClose }: LeadDetailHeaderProps) => {
  return (
    <div className="relative p-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{lead.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {lead.email}
            </div>
            {lead.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </div>
            )}
          </div>
          
          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lead.tags.slice(0, 3).map(tag => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="text-xs backdrop-blur-sm"
                  style={{ 
                    backgroundColor: tag.color + '15', 
                    color: tag.color,
                    borderColor: tag.color + '30'
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
              {lead.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-50/80 text-gray-600">
                  +{lead.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Status */}
          {lead.column && (
            <Badge 
              className="backdrop-blur-sm"
              style={{ 
                backgroundColor: lead.column.color + '20',
                borderColor: lead.column.color + '40',
                color: lead.column.color
              }}
            >
              {lead.column.name}
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-white/20 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
