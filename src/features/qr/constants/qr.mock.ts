import { Post, PostType } from "@/src/features/post/types";
import { SubscriptionStatus, UserSubscription, UserSubscriptionPlan } from "@/src/features/qr/types";

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

export const MOCK_USER_SUBSCRIPTION_PLANS: UserSubscriptionPlan[] = [
  {
    id: "monthly",
    label: "1 Month",
    description: "Billed monthly",
    price: "$4.99",
    unit: "/mo",
    priceId: "price_1T3B5zQqedaIws15A0XEX6HR",
    badge: null,
  },
  {
    id: "quarterly",
    label: "3 Months",
    description: "Billed quarterly",
    price: "$12.99",
    unit: "/3 mos",
    priceId: "price_1T3B5zQqedaIws15A0XEX6HR",
    badge: null,
  },
  {
    id: "yearly",
    label: "1 Year",
    description: "Save 33% annually",
    price: "$39.99",
    unit: "/yr",
    priceId: "price_1T3B5zQqedaIws15A0XEX6HR",
    badge: "BEST VALUE",
  },
];

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

const MOCK_AUTHOR = {
  id: "user_mock_123",
  displayName: "Alex Johnson",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
};

export const MOCK_MY_POSTS: Post[] = [
  {
    id: "post_mock_001",
    postType: PostType.Lost,
    itemName: "Lost Car Keys",
    description: "Lost my car keys near the parking lot.",
    distinctiveMarks: "Red keychain with a small flashlight",
    imageUrls: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    eventTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    location: { latitude: 10.7769, longitude: 106.7009 },
    displayAddress: "Central Park",
    externalPlaceId: null,
    radiusKm: 0,
    author: MOCK_AUTHOR,
  },
  {
    id: "post_mock_002",
    postType: PostType.Lost,
    itemName: "Black Leather Wallet",
    description: "Left my wallet on the bus seat.",
    distinctiveMarks: 'Initials "A.J." engraved on the inside',
    imageUrls: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=400"],
    eventTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    location: { latitude: 10.7821, longitude: 106.6994 },
    displayAddress: "Downtown Bus #42",
    externalPlaceId: null,
    radiusKm: 0,
    author: MOCK_AUTHOR,
  },
  {
    id: "post_mock_003",
    postType: PostType.Lost,
    itemName: "AirPods Pro Case",
    description: "Forgot my AirPods case at the coffee shop.",
    distinctiveMarks: "White case with a small sticker on the back",
    imageUrls: ["https://images.unsplash.com/photo-1606741965509-717c4efde069?w=400"],
    eventTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    location: { latitude: 10.7756, longitude: 106.7019 },
    displayAddress: "Coffee Shop",
    externalPlaceId: null,
    radiusKm: 0,
    author: MOCK_AUTHOR,
  },
];