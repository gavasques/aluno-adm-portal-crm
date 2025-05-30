import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Star } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { motion } from 'framer-motion';

interface LeadDetailHeaderProps {
  lead: CRMLead;
  onClose?: () => void; // Make optional since it's not always needed
}

export const LeadDetailHeader = ({ lead, onClose }: LeadDetailHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getScoreColor = (hasCompany: boolean, amazonSeller: boolean, ready3k: boolean) => {
    const score = (hasCompany ? 1 : 0) + (amazonSeller ? 1 : 0) + (ready3k ? 2 : 0);
    if (score >= 3) return 'text-green-600 bg-green-50';
    if (score >= 2) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="relative p-6 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Avatar className="h-16 w-16 ring-4 ring-white/20 shadow-xl">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </motion.div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {lead.email}
              </div>
              {lead.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {lead.phone}
                </div>
              )}
            </div>
            
            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
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
        </div>

        <div className="flex items-center gap-3">
          {/* Score de qualificação */}
          <div className={`px-3 py-2 rounded-lg ${getScoreColor(lead.has_company, lead.sells_on_amazon, lead.ready_to_invest_3k)} backdrop-blur-sm`}>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Score</span>
            </div>
          </div>

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

          {/* Remove close button or make it conditional */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-white/20 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
