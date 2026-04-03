
import { SubscriptionStatus, UserSubscription } from "@/src/features/qr/types";

export const IS_QR_FEATURE_MOCK = true;

export const MOCK_QR_CODE = {
  id: "69991b6e192ff90b71f5fc07",
  userId: "5UOM7YtiyVh5lRGVmPttmrKxTCR2",
  publicCode: "BTK-IXL0B840",
  createdAt: "2026-02-21T02:41:50.732Z",
  updatedAt: "2026-02-21T02:41:50.732Z"
}

export const MOCK_SUBSCRIPTION: UserSubscription = {
  id: "sub_mock_123",
  userId: "user_mock_123",
  planType: "Monthly",
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString(),
  cancelAtPeriodEnd: false,
  status: SubscriptionStatus.Active,
}

export const MOCK_QR_PLAN_DATA = {
  isActive: true,
  subscription: MOCK_SUBSCRIPTION
}

export const MOCK_QR_PROFILE = {
  memberSince: "2021",
  ownerNote:
    '"Hi! If you found this item, please leave it at the Building A reception desk or message me directly using the button below. Thank you so much!"',
  dropOffLocation: "Building A Reception",
  phone: "+1 (555) 012-3456",
};

export const MOCK_QR_CUSTOMIZE_DEFAULTS = {
  decor: "none" as const,
  background: "clean" as const,
  frame: "rounded" as const,
};

export const MOCK_QR_PROFILE_SETTINGS = {
  showFullName: true,
  showPhoneNumber: true,
  showEmailAddress: false,
  customMessage: MOCK_QR_PROFILE.ownerNote
};