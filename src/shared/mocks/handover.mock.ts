import type { AppUser } from "@/src/features/auth/types";
import type { Handover } from "@/src/features/handover/types";
import { POST_STORAGE_MOCK } from "@/src/shared/mocks/post.mock";

export const IS_HANDOVER_MOCK = true;

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

// ─── POST_MOCK index reference ─────────────────────────────────────────────────
// [0] Lost  — Samsung Super Fast Charging Adapter
// [1] Found — Silver MacBook Pro Charger
// [2] Lost  — Brown Leather Wallet
// [3] Found — Blue Backpack
// [4] Lost  — Honda Wave Key Set
// [5] Found — Vietnamese National ID Card

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

  // 1. Draft (Owner POV) — Both joined chat, coordinating. Finder has a "Mark Delivered" button.
  {
    id: "h-001-draft-owner",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: POST_STORAGE_MOCK[1], // Found: MacBook charger
    ownerPost: POST_STORAGE_MOCK[0],  // Lost: Samsung charger
    status: "Draft",
    activatedByRole: null,
    confirmedAt: null,
    expiresAt: "2026-04-30T00:00:00.000Z",
    createdAt: "2026-04-15T09:00:00.000Z",
  },

  // 2. Active (Owner POV) — Finder marked delivery; owner sees "Confirm Received" button.
  {
    id: "h-002-active-owner",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: POST_STORAGE_MOCK[1], // Found: MacBook charger
    ownerPost: POST_STORAGE_MOCK[0],  // Lost: Samsung charger
    status: "Active",
    activatedByRole: "Finder",
    confirmedAt: null,
    expiresAt: "2026-04-20T00:00:00.000Z",
    createdAt: "2026-04-08T14:30:00.000Z",
  },

  // ── Finder-perspective entries (current user = finder, found someone's item) ──

  // 3. Draft (Finder POV) — Both joined chat, coordinating. Current user sees "Mark Delivered" button.
  {
    id: "h-003-draft-finder",
    finder: CURRENT_USER_AS_FINDER,
    owner: OTHER_USER_B,
    finderPost: POST_STORAGE_MOCK[3], // Found: Blue backpack
    ownerPost: POST_STORAGE_MOCK[2],  // Lost: Brown wallet
    status: "Draft",
    activatedByRole: null,
    confirmedAt: null,
    expiresAt: "2026-04-28T00:00:00.000Z",
    createdAt: "2026-04-14T11:00:00.000Z",
  },

  // 4. Active (Finder POV) — Current user already marked delivery; sees "Delivery Marked" status.
  {
    id: "h-004-active-finder",
    finder: CURRENT_USER_AS_FINDER,
    owner: OTHER_USER_B,
    finderPost: POST_STORAGE_MOCK[5], // Found: Vietnamese ID card
    ownerPost: POST_STORAGE_MOCK[4],  // Lost: Honda keys
    status: "Active",
    activatedByRole: "Finder",
    confirmedAt: null,
    expiresAt: "2026-04-25T00:00:00.000Z",
    createdAt: "2026-04-10T15:00:00.000Z",
  },

  // ── Past entries ─────────────────────────────────────────────────────────────

  // 5. Confirmed — owner confirmed the return
  {
    id: "h-005-confirmed",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: POST_STORAGE_MOCK[3], // Found: Blue backpack
    ownerPost: POST_STORAGE_MOCK[2],  // Lost: Brown wallet
    status: "Confirmed",
    activatedByRole: "Finder",
    confirmedAt: "2026-03-26T10:15:00.000Z",
    expiresAt: "2026-04-02T00:00:00.000Z",
    createdAt: "2026-03-24T09:00:00.000Z",
  },

  // 6. Expired — confirmation window passed
  {
    id: "h-006-expired",
    finder: OTHER_USER_A,
    owner: CURRENT_USER_AS_OWNER,
    finderPost: POST_STORAGE_MOCK[1], // Found: MacBook charger
    ownerPost: POST_STORAGE_MOCK[4],  // Lost: Honda keys
    status: "Expired",
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
    finderPost: POST_STORAGE_MOCK[5], // Found: Vietnamese ID card
    ownerPost: POST_STORAGE_MOCK[4],  // Lost: Honda keys
    status: "Rejected",
    activatedByRole: null,
    confirmedAt: null,
    expiresAt: "2026-03-22T00:00:00.000Z",
    createdAt: "2026-03-15T08:00:00.000Z",
  },
];
