import { SSEProps } from "./index";

export interface KeycloakProps extends SSEProps {
  /**
   * Keycloak OAuth Client ID
   */
  clientId?: string;
  /**
   * Keycloak OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Keycloak OAuth Server URL
   * @example http://192.168.1.10:8080/auth
   */
  serverUrl?: string;
  /**
   * Keycloak OAuth Realm
   */
  realm?: string;
  /**
   * Keycloak OAuth Scope
   * @default []
   * @see https://www.keycloak.org/docs/latest/authorization_services/
   * @example ['openid']
   */
  scope?: string[];
  /**
   * Extra authorization parameters to provide to the authorization URL
   */
  authorizationParams?: Record<string, string>;
}

export interface KeycloakProfile extends Record<string, any> {
  exp?: number;
  iat?: number;
  auth_time?: number;
  jti?: string;
  iss?: string;
  aud?: string;
  sub?: string;
  typ?: string;
  azp?: string;
  session_state?: string;
  at_hash?: string;
  acr?: string;
  sid?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
  user?: any;
}
