export type UserQrCode = {
  id: string;
  publicCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const SubscriptionPlan = {
  Monthly: 'Monthly',
  Yearly: 'Yearly',
} as const;

export type SubscriptionPlanType = typeof SubscriptionPlan[keyof typeof SubscriptionPlan];

export const SubscriptionStatus = {
  Active: 'Active',
  PastDue: 'PastDue',
  Unpaid: 'Unpaid',
  Incomplete: 'Incomplete',
  IncompleteExpired: 'IncompleteExpired',
  Canceled: 'Canceled',
} as const;

export type SubscriptionStatusType = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

export type UserSubscription = {
  id: string;
  userId: string;
  planType: SubscriptionPlanType;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  status: SubscriptionStatusType;
  cancelAtPeriodEnd: boolean;
}

export type UserSubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  currency: string;
  features: string[];
  providerPriceId: string;
};