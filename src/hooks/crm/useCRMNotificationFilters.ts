
import { useState } from 'react';

export const useCRMNotificationFilters = () => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const toggleUnreadFilter = () => {
    setShowUnreadOnly(!showUnreadOnly);
  };

  return {
    showUnreadOnly,
    setShowUnreadOnly,
    toggleUnreadFilter
  };
};
