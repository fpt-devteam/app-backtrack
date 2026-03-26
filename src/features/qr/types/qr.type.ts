import { Nullable } from "@/src/shared/types";

export type UserQrCode = {
  id: string;
  publicCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  note: Nullable<string>;
};

export const QrErrorCorrectionLevel = {
  L: "L",
  M: "M",
  Q: "Q",
  H: "H",
} as const;

export type QrErrorCorrectionLevelType =
  typeof QrErrorCorrectionLevel[keyof typeof QrErrorCorrectionLevel];

export type UserQrDesign = {
  id: string;
  userId: string;
  size: number;
  color: string;
  backgroundColor: string;
  quietZone: number;
  ecl: QrErrorCorrectionLevelType;
  logo: {
    url: string;
    size: number;
    margin: number;
    borderRadius: number;
    backgroundColor: string;
  };
  gradient: {
    enabled: boolean;
    colors: [string, string];
    direction: [number, number, number, number];
  };
  createdAt: string;
  updatedAt: string;
};

export type UpdateMyQrDesignRequest = Partial<
  Pick<
    UserQrDesign,
    "color" | "backgroundColor" | "ecl"
  >
> & {
  logo?: Partial<UserQrDesign["logo"]>;
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