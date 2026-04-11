export interface JwtAuth {
  signinUrl: string;
  signupUrl: string;
  refreshTokenUrl: string;
  tokenType: string;
  clients: Record<string, string>;
}

/** Per-identity-provider FedCM settings (e.g. `google` or any other IdP key). */
export interface FedcmProviderConfig {
  tokenUrl: string;
  configURL: string;
  clientId: string;
}

/** Provider id → FedCM config; supports multiple providers and arbitrary keys. */
export type FedcmAuth = Record<string, FedcmProviderConfig>;

export interface AuthConfig {
  sessionPrefix: string;
  authRedirectPath: string;
  appPath: string;
  jwtAuth?: JwtAuth;
  fedcm?: FedcmAuth;
}
