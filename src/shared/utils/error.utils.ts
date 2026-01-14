/**
 * Error utility for mapping error codes to user-friendly messages
 * Supports Firebase, API, and custom error codes
 */

export type ErrorCode = string;

export interface ErrorMapping {
  [key: string]: string;
}

/**
 * Firebase Authentication error messages
 */
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

/**
 * API error messages
 */
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

/**
 * Application-specific error messages
 */
const APP_ERRORS: ErrorMapping = {
  VALIDATION_ERROR: "Please check your input and try again.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  RESOURCE_NOT_FOUND: "The requested resource was not found.",
  DUPLICATE_ENTRY: "This entry already exists.",
  INVALID_INPUT: "Invalid input. Please check and try again.",
  OPERATION_FAILED: "Operation failed. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};

/**
 * Default error message
 */
const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred. Please try again.";

/**
 * Combined error mapping
 */
const ERROR_MESSAGES: ErrorMapping = {
  ...FIREBASE_AUTH_ERRORS,
  ...API_ERRORS,
  ...APP_ERRORS,
};

/**
 * Extracts error code from various error object formats
 */
const extractErrorCode = (error: any): string | null => {
  if (!error) return null;

  // Direct error code
  if (error.code) return error.code;

  // Nested error code
  if (error.error?.code) return error.error.code;

  // HTTP status code
  if (error.status) return String(error.status);
  if (error.statusCode) return String(error.statusCode);

  // Response status
  if (error.response?.status) return String(error.response.status);

  return null;
};

/**
 * Extracts error message from various error object formats
 */
const extractErrorMessage = (error: any): string | null => {
  if (!error) return null;

  // Direct message
  if (typeof error === "string") return error;
  if (error.message) return error.message;

  // Nested message
  if (error.error?.message) return error.error.message;

  // Response message
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.message) return error.response.message;

  return null;
};

/**
 * Checks if a message contains specific keywords
 */
const containsKeyword = (message: string, keywords: string[]): boolean => {
  const lowerMessage = message.toLowerCase();
  return keywords.some((keyword) =>
    lowerMessage.includes(keyword.toLowerCase())
  );
};

/**
 * Pattern-based error detection
 */
const detectErrorByPattern = (message: string): string | null => {
  if (containsKeyword(message, ["network", "connection", "offline"])) {
    return ERROR_MESSAGES["NETWORK_ERROR"];
  }

  if (containsKeyword(message, ["timeout", "timed out"])) {
    return ERROR_MESSAGES["TIMEOUT_ERROR"];
  }

  if (containsKeyword(message, ["password", "incorrect", "wrong"])) {
    return ERROR_MESSAGES["auth/wrong-password"];
  }

  if (containsKeyword(message, ["email", "invalid email"])) {
    return ERROR_MESSAGES["auth/invalid-email"];
  }

  if (containsKeyword(message, ["not found", "404"])) {
    return ERROR_MESSAGES["404"];
  }

  if (containsKeyword(message, ["unauthorized", "401", "unauthenticated"])) {
    return ERROR_MESSAGES["401"];
  }

  if (containsKeyword(message, ["forbidden", "403", "permission"])) {
    return ERROR_MESSAGES["403"];
  }

  return null;
};

/**
 * Checks if a message is user-friendly
 */
const isUserFriendly = (message: string): boolean => {
  if (!message || message.length > 150) return false;

  // Filter out technical messages
  const technicalKeywords = [
    "Firebase",
    "firebase",
    "Error:",
    "Exception",
    "Stack trace",
    "at Object",
    "undefined",
    "null",
    "NaN",
  ];

  return !containsKeyword(message, technicalKeywords);
};

/**
 * Main function to get user-friendly error message
 *
 * @param error - Error object, error code, or error message
 * @returns User-friendly error message
 *
 * @example
 * ```typescript
 * // With Firebase error
 * const message = getErrorMessage({ code: 'auth/wrong-password' });
 * // Returns: "Incorrect password. Please try again or reset your password."
 *
 * // With HTTP error
 * const message = getErrorMessage({ status: 404 });
 * // Returns: "Resource not found. Please check and try again."
 *
 * // With error code string
 * const message = getErrorMessage('auth/user-not-found');
 * // Returns: "No account found with this email. Please check your email or sign up."
 * ```
 */
export const getErrorMessage = (error: any): string => {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  // If error is a string, treat it as error code
  if (typeof error === "string") {
    return ERROR_MESSAGES[error] || DEFAULT_ERROR_MESSAGE;
  }

  // 1. Try to get message by error code
  const errorCode = extractErrorCode(error);
  if (errorCode && ERROR_MESSAGES[errorCode]) {
    return ERROR_MESSAGES[errorCode];
  }

  // 2. Try to extract and analyze error message
  const errorMessage = extractErrorMessage(error);
  if (errorMessage) {
    // Try pattern matching
    const patternMatch = detectErrorByPattern(errorMessage);
    if (patternMatch) return patternMatch;

    // Return original message if it's user-friendly
    if (isUserFriendly(errorMessage)) {
      return errorMessage;
    }
  }

  // 3. Return default message
  return DEFAULT_ERROR_MESSAGE;
};

/**
 * Checks if an error code exists in the mapping
 */
export const hasErrorMapping = (errorCode: ErrorCode): boolean => {
  return errorCode in ERROR_MESSAGES;
};

/**
 * Gets error message by error code directly
 */
export const getErrorMessageByCode = (errorCode: ErrorCode): string => {
  return ERROR_MESSAGES[errorCode] || DEFAULT_ERROR_MESSAGE;
};

/**
 * Adds custom error mappings at runtime
 */
export const addErrorMapping = (code: ErrorCode, message: string): void => {
  ERROR_MESSAGES[code] = message;
};

/**
 * Adds multiple custom error mappings at runtime
 */
export const addErrorMappings = (mappings: ErrorMapping): void => {
  Object.assign(ERROR_MESSAGES, mappings);
};


export function getErrorMessage2(error: unknown, fallback = 'An unknown error occurred'): string {
  return (
    (error as any)?.response?.data?.error?.message ||
    (error as any)?.error?.message ||
    (error as any)?.message ||
    fallback
  )
}