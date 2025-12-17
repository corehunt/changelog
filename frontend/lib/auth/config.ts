/**
 * Authentication Configuration
 *
 * Set AUTH_ENABLED to true to enable authentication for protected routes.
 * When disabled, all routes are accessible without authentication.
 */

// TODO combe back to enable when go live
export const AUTH_ENABLED = false;

// where we store the JWT from AuthResponse.accessToken
export const TOKEN_STORAGE_KEY = 'changelog_token';
