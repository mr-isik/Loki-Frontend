/**
 * Authentication utility functions
 * Centralized cookie and token management
 */

/**
 * Cookie configuration
 */
const COOKIE_CONFIG = {
  accessToken: {
    name: "accessToken",
    maxAge: 900, // 15 minutes
  },
  refreshToken: {
    name: "refreshToken",
    maxAge: 2592000, // 30 days
  },
} as const;

/**
 * Set authentication tokens in cookies
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  document.cookie = `${COOKIE_CONFIG.accessToken.name}=${accessToken}; path=/; max-age=${COOKIE_CONFIG.accessToken.maxAge}; SameSite=Strict; Secure`;
  document.cookie = `${COOKIE_CONFIG.refreshToken.name}=${refreshToken}; path=/; max-age=${COOKIE_CONFIG.refreshToken.maxAge}; SameSite=Strict; Secure`;
}

/**
 * Clear all authentication cookies
 */
export function clearAuthTokens(): void {
  // Set cookies with past expiration date to delete them
  document.cookie = `${COOKIE_CONFIG.accessToken.name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${COOKIE_CONFIG.refreshToken.name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Get a specific cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

/**
 * Check if user is authenticated (has both tokens)
 */
export function isAuthenticated(): boolean {
  const accessToken = getCookie(COOKIE_CONFIG.accessToken.name);
  const refreshToken = getCookie(COOKIE_CONFIG.refreshToken.name);

  return !!(accessToken && refreshToken);
}

/**
 * Redirect to login page with optional callback URL
 */
export function redirectToLogin(callbackUrl?: string): void {
  const loginUrl = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";

  window.location.href = loginUrl;
}

/**
 * Handle logout - clear tokens and redirect
 */
export function handleLogout(redirectUrl = "/login"): void {
  clearAuthTokens();
  window.location.href = redirectUrl;
}

/**
 * Handle social login (Google, Facebook, etc.)
 */
export function handleSocialLogin(provider: "google" | "facebook"): void {
  switch (provider) {
    case "google":
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

      break;
    case "facebook":
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;

      break;
    default:
      throw new Error("Desteklenmeyen sosyal giriş sağlayıcısı");
  }
}
