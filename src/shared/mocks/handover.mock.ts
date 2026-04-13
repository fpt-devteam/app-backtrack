import type { AppUser } from "@/src/features/auth/types";
import type { Handover } from "@/src/features/handover/types";
import { POST_STORAGE_MOCK } from "@/src/shared/mocks/post.mock";

export const IS_HANDOVER_MOCK = true;

// ─── Shared users ──────────────────────────────────────────────────────────────

/** The current app user — acts as the item owner (lost something) */
const OWNER_USER: AppUser = {
  id: "UiJ8fa0Ho5Mr167FqqW2rmbpJMu1",
  displayName: "Phi Long",
  email: "philong@example.com",
  phone: null,
  avatarUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocJBWhbZxxBnmwQFXU40fMepk8d5XkDz9jyM-zRpPcCjry36LCo=s96-c",
  globalRole: "user",
  showEmail: true,
  showPhone: false,
};

/** Counter-party — the person who found the item */
const FINDER_USER: AppUser = {
  id: "finder-user-tran-minh-khoa",
  displayName: "Trần Minh Khoa",
  email: "minhkhoa@example.com",
  phone: "+84901234567",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
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

export const HANDOVER_MOCK: Handover[] = [
  // 1. Draft — owner initiated, no finder matched yet
  {
    id: "h-001-draft",
    finder: null,
    owner: OWNER_USER,
    finderPost: null,
    ownerPost: POST_STORAGE_MOCK[0], // Lost: Samsung charger
    status: "Draft",
    confirmedAt: null,
    expiresAt: "2026-04-30T00:00:00.000Z",
    createdAt: "2026-04-01T09:00:00.000Z",
  },

  // 2. Active — both parties matched, awaiting owner confirmation
  {
    id: "h-002-active",
    finder: FINDER_USER,
    owner: OWNER_USER,
    finderPost: POST_STORAGE_MOCK[1], // Found: MacBook charger
    ownerPost: POST_STORAGE_MOCK[0], // Lost: Samsung charger
    status: "Active",
    confirmedAt: null,
    expiresAt: "2026-04-20T00:00:00.000Z",
    createdAt: "2026-04-08T14:30:00.000Z",
  },

  // 3. Confirmed — owner confirmed the return
  {
    id: "h-003-confirmed",
    finder: FINDER_USER,
    owner: OWNER_USER,
    finderPost: POST_STORAGE_MOCK[3], // Found: Blue backpack
    ownerPost: POST_STORAGE_MOCK[2], // Lost: Brown wallet
    status: "Confirmed",
    confirmedAt: "2026-03-26T10:15:00.000Z",
    expiresAt: "2026-04-02T00:00:00.000Z",
    createdAt: "2026-03-24T09:00:00.000Z",
  },

  // 4. Rejected — owner rejected the match
  {
    id: "h-004-rejected",
    finder: FINDER_USER,
    owner: OWNER_USER,
    finderPost: POST_STORAGE_MOCK[5], // Found: Vietnamese ID card
    ownerPost: POST_STORAGE_MOCK[4], // Lost: Honda keys
    status: "Rejected",
    confirmedAt: null,
    expiresAt: "2026-03-22T00:00:00.000Z",
    createdAt: "2026-03-15T08:00:00.000Z",
  },

  // 5. Expired — confirmation window passed with no action
  {
    id: "h-005-expired",
    finder: FINDER_USER,
    owner: OWNER_USER,
    finderPost: POST_STORAGE_MOCK[1], // Found: MacBook charger
    ownerPost: POST_STORAGE_MOCK[4], // Lost: Honda keys
    status: "Expired",
    confirmedAt: null,
    expiresAt: "2026-03-12T00:00:00.000Z",
    createdAt: "2026-03-08T11:00:00.000Z",
  },

  // 6. Active — another ongoing case (finder only linked so far)
  {
    id: "h-006-active",
    finder: FINDER_USER,
    owner: OWNER_USER,
    finderPost: POST_STORAGE_MOCK[3], // Found: Blue backpack
    ownerPost: POST_STORAGE_MOCK[4], // Lost: Honda keys
    status: "Active",
    confirmedAt: null,
    expiresAt: "2026-04-25T00:00:00.000Z",
    createdAt: "2026-04-10T15:00:00.000Z",
  },
];
