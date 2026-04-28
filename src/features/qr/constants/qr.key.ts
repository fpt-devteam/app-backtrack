export const QR_CODES_ME_QUERY_KEY = ["qr-codes-", "me"] as const;
export const QR_CODES_ME_DESIGN_QUERY_KEY = ["qr-codes", "me", "design"] as const;
export const QR_CODES_ME_NOTE_QUERY_KEY = ["qr-codes", "me", "note"] as const;

export const QR_SUBSCRIPTION_ME_QUERY_KEY = ["qr-subscription", "me"] as const;

export const QR_CANCEL_SUBSCRIPTION_MUTATION_KEY = ["qr-cancel-subscription"] as const;

export const QR_SUBSCRIBE_MUTATION_KEY = ["qr-subscription", "create"] as const;

export const QR_UPDATE_DESIGN_MUTATION_KEY = ["qr-design", "update"] as const;

export const QR_GET_ALL_SUBSCRIPTION_PLANS_QUERY_KEY = ["qr-subscription", "plans"] as const;