export interface ErrorMapping {
  [key: string]: string;
}

const FIREBASE_AUTH_ERRORS: ErrorMapping = {
  // Authentication errors
  "auth/invalid-email":
    "The email address is not valid. Please check and try again.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",
  "auth/user-not-found":
    "No account found with this email. Please check your email or sign up.",
  "auth/wrong-password":
    "Incorrect password. Please try again or reset your password.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/invalid-login-credentials":
    "Invalid email or password. Please check your credentials.",

  // Rate limiting
  "auth/too-many-requests":
    "Too many failed login attempts. Please try again later or reset your password.",

  // Network errors
  "auth/network-request-failed":
    "Network error. Please check your internet connection and try again.",

  // Email verification
  "auth/email-already-in-use":
    "This email is already registered. Please sign in instead.",
  "auth/operation-not-allowed":
    "Email/password sign-in is not enabled. Please contact support.",

  // Token errors
  "auth/expired-action-code":
    "This link has expired. Please request a new one.",
  "auth/invalid-action-code": "This link is invalid. Please request a new one.",

  // Weak password
  "auth/weak-password":
    "Password is too weak. Please use at least 6 characters.",

  // Account exists with different credential
  "auth/account-exists-with-different-credential":
    "An account already exists with this email using a different sign-in method.",

  // Popup/redirect errors
  "auth/popup-blocked":
    "The sign-in popup was blocked. Please allow popups and try again.",
  "auth/popup-closed-by-user":
    "The sign-in popup was closed. Please try again.",

  // Missing credentials
  "auth/missing-email": "Please enter your email address.",
  "auth/missing-password": "Please enter your password.",

  // Internal errors
  "auth/internal-error": "An internal error occurred. Please try again later.",

  // Session errors
  "auth/requires-recent-login":
    "This action requires recent authentication. Please sign in again.",
  "auth/user-token-expired": "Your session has expired. Please sign in again.",

  // Multi-factor authentication
  "auth/multi-factor-auth-required":
    "Additional verification is required. Please complete the authentication process.",
  "auth/maximum-second-factor-count-exceeded":
    "Maximum number of second factors exceeded.",

  // Phone authentication
  "auth/invalid-phone-number":
    "The phone number is not valid. Please check and try again.",
  "auth/missing-phone-number": "Please enter your phone number.",
  "auth/quota-exceeded": "SMS quota exceeded. Please try again later.",

  // Email link authentication
  "auth/invalid-email-link": "The email link is invalid or has expired.",
  "auth/email-change-needs-verification":
    "Email change requires verification. Please check your inbox.",
};

const API_ERRORS: ErrorMapping = {
  // HTTP status codes
  "400": "Bad request. Please check your input and try again.",
  "401": "Unauthorized. Please sign in to continue.",
  "403": "Access denied. You don't have permission to perform this action.",
  "404": "Resource not found. Please check and try again.",
  "408": "Request timeout. Please check your connection and try again.",
  "409": "Conflict. This resource already exists.",
  "422": "Validation error. Please check your input.",
  "429": "Too many requests. Please slow down and try again later.",
  "500": "Server error. Please try again later.",
  "502": "Bad gateway. Please try again later.",
  "503": "Service unavailable. Please try again later.",
  "504": "Gateway timeout. Please try again later.",

  // Network errors
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  CONNECTION_ERROR: "Connection error. Please check your internet connection.",
};
const APP_ERRORS: ErrorMapping = {
  VALIDATION_ERROR: "Please check your input and try again.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  RESOURCE_NOT_FOUND: "The requested resource was not found.",
  DUPLICATE_ENTRY: "This entry already exists.",
  INVALID_INPUT: "Invalid input. Please check and try again.",
  OPERATION_FAILED: "Operation failed. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  NoActiveSubscription: "You don't have an active subscription",
  SubscriptionAlreadySubscribed: "You are already subscribed to a plan",
};

const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred. Please try again.";

/**
 * Extracts error message from various error structures
 */
export function getErrorMessage(
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE
): string {

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)?.response?.data?.error?.message ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)?.error?.message ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)?.message ||
    fallback
  );
}