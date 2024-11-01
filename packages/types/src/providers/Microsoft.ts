import { SSEProps } from "./index";

type MicrosoftProfilePhoto = 48 | 64 | 96 | 120 | 240 | 360 | 432 | 504 | 648;
export interface MicrosoftProps extends SSEProps {
  /**
   * Microsoft OAuth Client ID
   */
  clientId?: string;
  /**
   * Microsoft  OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Microsoft OAuth Tenant ID
   */
  tenant?: string;
  /**
   * Microsoft  OAuth Scope
   * @default ['User.Read']
   * @see https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc
   */
  scope?: string[];
  /**
   * Microsoft OAuth Authorization URL
   * @default 'https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize'
   * @see https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
   */
  authorizationURL?: string;
  /**
   * Microsoft OAuth Token URL
   * @default 'https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token'
   * @see https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
   */
  tokenURL?: string;
  /**
   * Microsoft OAuth User URL
   * @default 'https://graph.microsoft.com/v1.0/me'
   * @see https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http
   */
  userURL?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
   */
  authorizationParams?: Record<string, string>;
  /**
   * Redirect URL to prevent in prod prevent redirect_uri mismatch http to https
   * @see https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
   */
  redirectUrl?: string;
  /** */
  profilePhotoSize: MicrosoftProfilePhoto;
}

export interface MicrosoftEntraIDProfile extends Record<string, any> {
  sub: string;
  nickname: string;
  email: string;
  picture: string;
  [key: string]: any;
}
