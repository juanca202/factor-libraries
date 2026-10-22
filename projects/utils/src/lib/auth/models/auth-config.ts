export interface JwtAuthConfig {
  signinUrl: string;
  signupUrl: string;
  refreshTokenUrl: string;
  tokenType: string;
  clients: Record<string, string>;
  redirectUri: string;
  loginRedirectUri: string;
  postLogoutRedirectUri?: string;
  enabledSignup?: boolean;
  enabledRefreshToken?: boolean;
}

/** Per-identity-provider FedCM settings (e.g. `google` or any other IdP key). */
export interface FedcmProviderConfig {
  tokenUrl: string;
  configURL: string;
  clientId: string;
  enabled?: boolean;
}

/** Provider id → FedCM config; supports multiple providers and arbitrary keys. */
export type FedcmAuthConfig = Record<string, FedcmProviderConfig>;
