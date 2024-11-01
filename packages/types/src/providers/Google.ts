import { SSEProps } from "./index";

export interface GoogleProps extends SSEProps {
  /**
   * Google OAuth Client ID
   */
  clientId?: string;

  /**
   * Google OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * Google OAuth Scope
   * @default []
   * @see https://developers.google.com/identity/protocols/oauth2/scopes#google-sign-in
   * @example ['email', 'openid', 'profile']
   */
  scope?: string[];

  /**
   * Google OAuth Authorization URL
   * @default 'https://accounts.google.com/o/oauth2/v2/auth'
   */
  authorizationURL?: string;

  /**
   * Google OAuth Token URL
   * @default 'https://oauth2.googleapis.com/token'
   */
  tokenURL?: string;

  /**
   * Google OAuth User URL
   * @default 'https://www.googleapis.com/oauth2/v3/userinfo'
   */
  userURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developers.google.com/identity/protocols/oauth2/web-server#httprest_3
   * @example { access_type: 'offline' }
   */
  authorizationParams?: Record<string, string>;
}

export interface GoogleProfile extends Record<string, any> {
  aud?: string;
  azp?: string;
  email?: string;
  email_verified?: boolean;
  exp?: number;
  family_name?: string;
  given_name?: string;
  hd?: string;
  iat?: number;
  iss?: string;
  jti?: string;
  locale?: string;
  name?: string;
  nbf?: number;
  picture?: string;
  sub?: string;
}

type ErrorCode =
  | "invalid_request"
  | "access_denied"
  | "unauthorized_client"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable";

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  hd?: string;
  prompt?: string;
  token_type: string;
  scope?: string;
  state?: string;
  error?: ErrorCode;
  error_description?: string;
  error_uri?: string;
}
