
import { useCreditStatus } from './useCreditStatus';
import { useCreditActions } from './useCreditActions';

export const useCredits = () => {
  const { creditStatus, isLoading, error, refreshCredits } = useCreditStatus();
  const { consumeCredits, purchaseCredits, subscribeCredits } = useCreditActions(refreshCredits);

  return {
    creditStatus,
    isLoading,
    error,
    refreshCredits,
    consumeCredits,
    purchaseCredits,
    subscribeCredits
  };
};
