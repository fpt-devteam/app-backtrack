import type { AppUser } from "@/src/features/auth/types";
import type { Handover, HandoverPost } from "@/src/features/handover/types";
import { PostType } from "@/src/features/post/types";

export const IS_HANDOVER_MOCK = false;

// ─── Shared users ──────────────────────────────────────────────────────────────

/**
 * The current app user's Firebase UID.
 * Change this to match your local Firebase account when testing.
 */
const CURRENT_USER_ID = "UiJ8fa0Ho5Mr167FqqW2rmbpJMu1";

/** Current user profile — used in Owner-perspective entries */
const CURRENT_USER_AS_OWNER: AppUser = {
  id: CURRENT_USER_ID,
  displayName: "Phi Long",
  email: "philong@example.com",
  phone: null,
  avatarUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocJBWhbZxxBnmwQFXU40fMepk8d5XkDz9jyM-zRpPcCjry36LCo=s96-c",
  globalRole: "user",
  showEmail: true,
  showPhone: false,
};

/** Current user profile — used in Finder-perspective entries */
const CURRENT_USER_AS_FINDER: AppUser = {
  ...CURRENT_USER_AS_OWNER,
};

/** Counter-party A — found the item (acts as finder in owner-POV entries) */
const OTHER_USER_A: AppUser = {
  id: "finder-user-tran-minh-khoa",
  displayName: "Trần Minh Khoa",
  email: "minhkhoa@example.com",
  phone: "+84901234567",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  globalRole: "user",
  showEmail: true,
  showPhone: true,
};

/** Counter-party B — lost the item (acts as owner in finder-POV entries) */
const OTHER_USER_B: AppUser = {
  id: "owner-user-nguyen-thi-lan",
  displayName: "Nguyễn Thị Lan",
  email: "nguyenlan@example.com",
  phone: "+84987654321",
  avatarUrl: "https://i.pravatar.cc/150?img=47",
  globalRole: "user",
  showEmail: true,
  showPhone: true,
};

// ─── Slim author for HandoverPost objects ──────────────────────────────────────

const MOCK_AUTHOR_SLIM: Pick<AppUser, "id" | "displayName" | "avatarUrl"> = {
  id: "UiJ8fa0Ho5Mr167FqqW2rmbpJMu1",
  displayName: "Phi Long",
  avatarUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocJBWhbZxxBnmwQFXU40fMepk8d5XkDz9jyM-zRpPcCjry36LCo=s96-c",
};

// ─── HandoverPost fixtures ─────────────────────────────────────────────────────

const POST_H_SAMSUNG_ADAPTER: HandoverPost = {
  id: "b4d3a6ac-6d49-424c-b9f8-30a085fe6365",
  author: MOCK_AUTHOR_SLIM,
  postType: PostType.Lost,
  status: "Active",
  category: "electronics",
  subcategoryId: "charger_adapter",
  postTitle: "Black Samsung Super Fast Charging Wall Adapter",
  imageUrls: [
    "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2Fwhite_macbook_charger_2.jpg?alt=media&token=a96f55d8-7976-4a05-8820-b0d79927b11b",
  ],
  location: { latitude: 10.8411276, longitude: 106.809883 },
  displayAddress:
    "Lô E2a, 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh, Vietnam",
  eventTime: "2026-03-23T10:06:18.845Z",
  createdAt: "2026-03-23T10:06:18.845Z",
};

const POST_H_BLUE_BACKPACK: HandoverPost = {
  id: "d4e5f6a7-8901-4bcd-ef01-23456789abcd",
  author: MOCK_AUTHOR_SLIM,
  postType: PostType.Found,
  status: "Active",
  category: "personal_belongings",
  subcategoryId: "backpack",
  postTitle: "Blue Backpack",
  imageUrls: ["https://picsum.photos/seed/blue-backpack/400/400"],
  location: { latitude: 10.8418, longitude: 106.8088 },
  displayAddress:
    "FPT University Football Field, Thủ Đức, Hồ Chí Minh, Vietnam",
  eventTime: "2026-03-15T17:45:00.000Z",
  createdAt: "2026-03-15T18:30:00.000Z",
};

const POST_H_ID_CARD: HandoverPost = {
  id: "f6a7b8c9-0123-4def-0123-456789abcdef",
  author: MOCK_AUTHOR_SLIM,
  postType: PostType.Found,
  status: "Active",
  category: "card",
  subcategoryId: "identification_card",
  postTitle: "Vietnamese National ID Card",
  imageUrls: ["https://picsum.photos/seed/id-card/400/400"],
  location: { latitude: 10.8413, longitude: 106.8096 },
  displayAddress: "FPT University Building A, Thủ Đức, Hồ Chí Minh, Vietnam",
  eventTime: "2026-03-08T11:20:00.000Z",
  createdAt: "2026-03-08T12:00:00.000Z",
};

const POST_H_BROWN_WALLET: HandoverPost = {
  id: "c3d4e5f6-7890-4abc-def0-123456789abc",
  author: MOCK_AUTHOR_SLIM,
  postType: PostType.Lost,
  status: "Active",
  category: "personal_belongings",
  subcategoryId: "wallets",
  postTitle: "Brown Leather Wallet",
  imageUrls: ["https://picsum.photos/seed/brown-wallet/400/400"],
  location: { latitude: 10.8405, longitude: 106.8102 },
  displayAddress: "FPT University Parking Lot, Thủ Đức, Hồ Chí Minh",
  eventTime: "2026-03-18T08:15:00.000Z",
  createdAt: "2026-03-18T09:00:00.000Z",
};

const POST_H_HONDA_KEYS: HandoverPost = {
  id: "e5f6a7b8-9012-4cde-f012-3456789abcde",
  author: MOCK_AUTHOR_SLIM,
  postType: PostType.Lost,
  status: "Active",
  category: "personal_belongings",
  subcategoryId: "keys",
  postTitle: "Honda Wave Key Set",
  imageUrls: ["https://picsum.photos/seed/honda-keys/400/400"],
  location: { latitude: 10.8415, longitude: 106.8091 },
  displayAddress: "FPT University Main Gate, Thủ Đức, Hồ Chí Minh, Vietnam",
  eventTime: "2026-03-10T07:00:00.000Z",
  createdAt: "2026-03-10T07:30:00.000Z",
};

// ─── Mock handovers ────────────────────────────────────────────────────────────

export const getMockHandoverById = (id: string): Handover | null =>
  HANDOVER_MOCK.find((h) => h.id === id) ?? null;

/**
 * Returns the mock handover, dynamically replacing the static CURRENT_USER_ID
 * with the actual logged-in user's UID.  This ensures isFinder / isOwner
 * comparisons work correctly regardless of which Firebase account is signed in.
 */
export const getMockHandoverByIdForUser = (
  id: string,
  currentUserId?: string,
): Handover | null => {
  const mock = getMockHandoverById(id);
  if (!mock || !currentUserId) return mock;
  return swapCurrentUserId(mock, currentUserId);
};

function swapCurrentUserId(mock: Handover, currentUserId: string): Handover {
  const swap = (user: AppUser | null): AppUser | null => {
    if (!user || user.id !== CURRENT_USER_ID) return user;
    return { ...user, id: currentUserId };
  };
  return { ...mock, finder: swap(mock.finder), owner: swap(mock.owner) };
}

export const HANDOVER_MOCK: Handover[] = [
  // ── Owner-perspective entries (current user = owner, lost an item) ───────────

  // 1. Ongoing (Owner POV) — Meetup agreed for late afternoon; finder still needs to hand it over.
  {
    id: "h-001-draft-owner",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: null,
    ownerPost: POST_H_SAMSUNG_ADAPTER,
    status: "Ongoing",
    activatedByRole: null,
    confirmedAt: null,
    expiresAt: "2026-04-27T18:30:00.000Z",
    createdAt: "2026-04-18T09:30:00.000Z",
  },

  // 2. Delivered (Owner POV) — Finder says the charger was dropped with the lobby desk; owner needs to confirm.
  {
    id: "h-002-active-owner",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: null,
    ownerPost: POST_H_SAMSUNG_ADAPTER,
    status: "Delivered",
    activatedByRole: "Finder",
    confirmedAt: null,
    expiresAt: "2026-04-24T20:00:00.000Z",
    createdAt: "2026-04-16T14:30:00.000Z",
  },

  // ── Finder-perspective entries (current user = finder, found someone's item) ──

  // 3. Ongoing (Finder POV) — Owner can meet after class tomorrow; current user still needs to hand it over.
  {
    id: "h-003-draft-finder",
    finder: CURRENT_USER_AS_FINDER,
    owner: OTHER_USER_B,
    finderPost: POST_H_BLUE_BACKPACK,
    ownerPost: null,
    status: "Ongoing",
    activatedByRole: null,
    confirmedAt: null,
    expiresAt: "2026-04-26T17:00:00.000Z",
    createdAt: "2026-04-19T11:00:00.000Z",
  },

  // 4. Delivered (Finder POV) — ID card was left with campus security; waiting for the owner to confirm pickup.
  {
    id: "h-004-active-finder",
    finder: CURRENT_USER_AS_FINDER,
    owner: OTHER_USER_B,
    finderPost: POST_H_ID_CARD,
    ownerPost: null,
    status: "Delivered",
    activatedByRole: "Finder",
    confirmedAt: null,
    expiresAt: "2026-04-23T21:00:00.000Z",
    createdAt: "2026-04-17T15:00:00.000Z",
  },

  // ── Past entries ─────────────────────────────────────────────────────────────

  // 5. Confirmed — owner confirmed the return
  {
    id: "h-005-confirmed",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: null,
    ownerPost: POST_H_BROWN_WALLET,
    status: "Confirmed",
    activatedByRole: "Finder",
    confirmedAt: "2026-03-26T10:15:00.000Z",
    expiresAt: "2026-04-02T00:00:00.000Z",
    createdAt: "2026-03-24T09:00:00.000Z",
  },

  // 6. Closed — confirmation window passed (mismatch)
  {
    id: "h-006-expired",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: null,
    ownerPost: POST_H_HONDA_KEYS,
    status: "Closed",
    activatedByRole: null,
    confirmedAt: null,
    expiresAt: "2026-03-12T00:00:00.000Z",
    createdAt: "2026-03-08T11:00:00.000Z",
  },

  // 7. Rejected
  {
    id: "h-007-rejected",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: null,
    ownerPost: POST_H_HONDA_KEYS,
    status: "Rejected",
    activatedByRole: null,
    confirmedAt: null,
    expiresAt: "2026-03-22T00:00:00.000Z",
    createdAt: "2026-03-15T08:00:00.000Z",
  },
];
