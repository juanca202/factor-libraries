export interface JwtAuth {
  signinUrl: string;
  signupUrl: string;
  refreshTokenUrl: string;
  tokenType: string;
  clients: Record<string, string>;
  redirectUri: string;
  postLogoutRedirectUri: string;
  sessionPrefix: string;
}

/** Per-identity-provider FedCM settings (e.g. `google` or any other IdP key). */
export interface FedcmProviderConfig {
  tokenUrl: string;
  configURL: string;
  clientId: string;
}

/** Provider id → FedCM config; supports multiple providers and arbitrary keys. */
export type FedcmAuth = Record<string, FedcmProviderConfig>;
