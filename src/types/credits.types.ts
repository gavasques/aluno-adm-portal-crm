
export interface UserCredits {
  id: string;
  user_id: string;
  current_credits: number;
  monthly_limit: number;
  used_this_month: number;
  renewal_date: string;
  subscription_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: 'uso' | 'compra' | 'renovacao' | 'assinatura';
  amount: number;
  description: string;
  stripe_session_id: string | null;
  created_at: string;
}

export interface CreditSubscription {
  id: string;
  user_id: string;
  monthly_credits: number;
  stripe_subscription_id: string | null;
  status: 'active' | 'cancelled' | 'past_due';
  next_billing_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreditStatus {
  credits: {
    current: number;
    used: number;
    limit: number;
    renewalDate: string;
    usagePercentage: number;
  };
  subscription: CreditSubscription | null;
  transactions: CreditTransaction[];
  alerts: {
    lowCredits: boolean;
    noCredits: boolean;
  };
}

export interface PurchaseOption {
  credits: number;
  price: number;
  originalPrice: number;
  discount?: number;
  popular?: boolean;
}

export interface SubscriptionPlan {
  monthlyCredits: number;
  price: number;
  description: string;
  popular?: boolean;
}
