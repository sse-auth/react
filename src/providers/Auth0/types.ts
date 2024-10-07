export type Auth0Props = {
  /**
   * Auth0 OAuth Client ID
   */
  clientId?: string;
  /**
   * Auth0 OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Auth0 OAuth Issuer
   */
  domain?: string;
  /**
   * Auth0 OAuth Audience
   */
  audience?: string;
  /**
   * Auth0 OAuth Scope
   * @default []
   * @see https://auth0.com/docs/get-started/apis/scopes/openid-connect-scopes
   * @example ['openid']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;
  /**
   * Maximum Authentication Age. If the elapsed time is greater than this value, the OP must attempt to actively re-authenticate the end-user.
   * @default 0
   * @see https://auth0.com/docs/authenticate/login/max-age-reauthentication
   */
  maxAge?: number;
  /**
   * Login connection. If no connection is specified, it will redirect to the standard Auth0 login page and show the Login Widget.
   * @default ''
   * @see https://auth0.com/docs/api/authentication#social
   * @example 'github'
   */
  connection?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://auth0.com/docs/api/authentication#social
   * @example { display: 'popup' }
   */
  authorizationParams?: Record<string, string>;
  /** */
  redirectUri?: string;
};
