
import React from 'react';
import { RecentComments } from '../lead-detail/RecentComments';

interface LeadCommentsTabProps {
  leadId: string;
}

const LeadCommentsTab = ({ leadId }: LeadCommentsTabProps) => {
  return (
    <div className="p-6 h-full">
      <RecentComments leadId={leadId} />
    </div>
  );
};

export default LeadCommentsTab;
