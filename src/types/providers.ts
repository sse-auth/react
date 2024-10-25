export interface UserProps {
  [key: string]: any;
}

type UxMode = "popup" | "redirect";

export interface SSEProps {
  /**
   * @default 'popup'
   */
  ux_mode?: UxMode;
  /**
   * @default window.location.orign
   */
  redirectUri?: string;
}

export interface ResponseObjProps<T extends UserProps = UserProps> {
  error: Error | null | unknown;
  accessToken: string | null | object;
  userData: T | null;
}

export type ResponseProps<T extends UserProps = UserProps> = {
  error: Error | null | unknown;
  accessToken: string | null;
  userData: T | null;
};

export type LoginButtonProps<T> = T & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
};

export type IconButtonProps<T> = T & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
  //   icon: IconProps["icon"];
  icon?: React.ReactNode | string;
  variant?: string;
  className?: string;
};

export enum DiscordScopes {
  IDENTIFY = "identify",
  EMAIL = "email",
  GUILDS = "guilds",
  GUILDS_JOIN = "guilds.join",
  GDM_JOIN = "gdm.join",
  MESSAGES_READ = "messages.read",
  RPC = "rpc",
  RPC_NOTIFICATIONS_READ = "rpc.notifications.read",
  RPC_VOICE_READ = "rpc.voice.read",
  RPC_VOICE_WRITE = "rpc.voice.write",
  RPC_ACTIVITIES_WRITE = "rpc.activities.write",
  BOT = "bot",
  WEBHOOK_INCOMING = "webhook.incoming",
  APPLICATIONS_BUILDS_UPLOAD = "applications.builds.upload",
  APPLICATIONS_BUILDS_READ = "applications.builds.read",
  APPLICATIONS_STORE_UPDATE = "applications.store.update",
  APPLICATIONS_ENTITLEMENTS = "applications.entitlements",
  ACTIVITIES_READ = "activities.read",
  ACTIVITIES_WRITE = "activities.write",
  RELATIONSHIPS_READ = "relationships.read",
}

export type Auth0Props = SSEProps & {
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
};

export type BattledotnetProps = {
  /**
   * Battle.net OAuth Client ID
   */
  clientId?: string;
  /**
   * Battle.net OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Battle.net OAuth Scope
   * @default []
   * @see https://develop.battle.net/documentation/guides/using-oauth
   * @example ['openid', 'wow.profile', 'sc2.profile', 'd3.profile']
   */
  scope?: string[];
  /**
   * Battle.net OAuth Region
   * @default EU
   * @see https://develop.battle.net/documentation/guides/using-oauth
   * @example EU (possible values: US, EU, APAC)
   */
  region?: string;
  /**
   * Battle.net OAuth Authorization URL
   * @default 'https://oauth.battle.net/authorize'
   */
  // authorizationURL?: string;
  /**
   * Battle.net OAuth Token URL
   * @default 'https://oauth.battle.net/token'
   */
  // tokenURL?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://develop.battle.net/documentation/guides/using-oauth/authorization-code-flow
   */
  authorizationParams?: Record<string, string>;
  /** */
  redirectUri?: string;
};

export type CognitoProps = SSEProps & {
  /**
   * AWS Cognito App Client ID
   */
  clientId?: string;
  /**
   * AWS Cognito App Client Secret
   */
  clientSecret?: string;
  /**
   * AWS Cognito User Pool ID
   */
  userPoolId?: string;
  /**
   * AWS Cognito Region
   */
  region?: string;
  /**
   * AWS Cognito Scope
   * @default []
   */
  scope?: string[];
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html
   */
  authorizationParams?: Record<string, string>;
};

export interface DiscordProps extends SSEProps {
  /**
   * Discord OAuth Client ID
   */
  clientId?: string;
  /**
   * Discord OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Discord OAuth Scope
   * @default []
   * @see https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
   * @example ['identify', 'email']
   * Without the identify scope the user will not be returned.
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['email'] scope if not present.
   * @default false
   */
  emailRequired?: boolean;
  /**
   * Require profile from user, adds the ['identify'] scope if not present.
   * @default true
   */
  profileRequired?: boolean;
  /**
   * Discord OAuth Authorization URL
   * @default 'https://discord.com/oauth2/authorize'
   */
  authorizationURL?: string;
  /**
   * Discord OAuth Token URL
   * @default 'https://discord.com/api/oauth2/token'
   */
  tokenURL?: string;
  /**
   * Discord OAuth User fetch URL
   * @default 'https://discord.com/api/users/@me'
   */
  userUrl?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see 'https://discord.com/developers/docs/topics/oauth2#authorization-code-grant'
   * @example { allow_signup: 'true' }
   */
  authorizationParams?: Record<string, string>;
}

export type GithubProps = {
  /**
   * GitHub OAuth Client ID
   */
  clientId?: string;
  /**
   * GitHub OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * GitHub OAuth Scope
   * @default []
   * @see https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
   * @example ['user:email']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['user:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * GitHub OAuth Authorization URL
   * @default 'https://github.com/login/oauth/authorize'
   */
  authorizationURL?: string;

  /**
   * GitHub OAuth Token URL
   * @default 'https://github.com/login/oauth/access_token'
   */
  tokenURL?: string;

  /**
   * GitHub OAuth Token URL
   * @default 'https://api.github.com/user'
   */
  userUrl?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
   * @example { allow_signup: 'true' }
   */
  authorizationParams?: Record<string, string>;
};

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

export interface LinkedInProps extends SSEProps {
  /**
   * LinkedIn OAuth Client ID
   */
  clientId?: string;
  /**
   * LinkedIn OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * LinkedIn OAuth Scope
   * @default ['openid', 'profile', 'email']
   * @example ['openid', 'profile']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * LinkedIn OAuth Authorization URL
   * @default 'https://www.linkedin.com/oauth/v2/authorization'
   */
  authorizationURL?: string;
  /**
   * LinkedIn OAuth Token URL
   * @default 'https://www.linkedin.com/oauth/v2/accessToken'
   */
  tokenURL?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin/context
   */
  authorizationParams?: Record<string, string>;
}

// Microsoft
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

export interface PaypalProps extends SSEProps {
  /**
   * PayPal Client ID
   */
  clientId?: string;

  /**
   * PayPal OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * PayPal OAuth Scope
   * @default []
   * @see https://developer.paypal.com/docs/log-in-with-paypal/integrate/reference/#scope-attributes
   * @example ['email', 'profile']
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Use PayPal sandbox environment
   * @default false // true in development, false in production
   */
  sandbox?: boolean;

  /**
   * PayPal OAuth Authorization URL
   * @default 'https://www.paypal.com/signin/authorize'
   */
  authorizationURL?: string;

  /**
   * PayPal OAuth Token URL
   * @default 'https://api-m.paypal.com/v1/oauth2/token'
   */
  tokenURL?: string;

  /**
   * Paypal OAuth User URL
   * @default 'https://api-m.paypal.com/v1/identity/openidconnect/userinfo'
   */
  userURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developer.paypal.com/docs/log-in-with-paypal/integrate/build-button/#link-constructauthorizationendpoint
   * @example { flowEntry: 'static' }
   */
  authorizationParams?: Record<string, string>;
}

export interface SpotifyProps extends SSEProps {
  /**
   * Spotify OAuth Client ID
   */
  clientId?: string;
  /**
   * Spotify OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Spotify OAuth Scope
   * @default []
   * @see https://developer.spotify.com/documentation/web-api/concepts/scopes
   * @example ['user-read-email']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['user-read-email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Spotify OAuth Authorization URL
   * @default 'https://accounts.spotify.com/authorize'
   */
  authorizationURL?: string;

  /**
   * Spotify OAuth Token URL
   * @default 'https://accounts.spotify.com/api/token'
   */
  tokenURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see 'https://developer.spotify.com/documentation/web-api/tutorials/code-flow'
   * @example { show_dialog: 'true' }
   */
  authorizationParams?: Record<string, string>;

  /**
   * direct redirection or not
   * @default false
   */
  show_dialog?: boolean;
}

export interface SteamProps extends SSEProps {
  /**
   * Steam API Key
   * @see https://steamcommunity.com/dev
   */
  apiKey?: string;

  /**
   * Steam Open ID OAuth Authorization URL
   * @default 'https://steamcommunity.com/openid/login'
   */
  authorizationURL?: string;
}

export interface TwitchProps extends SSEProps {
  /**
   * Twitch Client ID
   */
  clientId?: string;

  /**
   * Twitch OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * Twitch OAuth Scope
   * @default []
   * @see https://dev.twitch.tv/docs/authentication/scopes
   * @example ['user:read:email']
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['user:read:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Twitch OAuth Authorization URL
   * @default 'https://id.twitch.tv/oauth2/authorize'
   */
  authorizationURL?: string;

  /**
   * Twitch OAuth Token URL
   * @default 'https://id.twitch.tv/oauth2/token'
   */
  tokenURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
   * @example { force_verify: 'true' }
   */
  authorizationParams?: Record<string, string>;
}

export interface XProps extends SSEProps {
  /**
   * X OAuth Client ID
   * @default process.env.NUXT_OAUTH_X_CLIENT_ID
   */
  clientId?: string;
  /**
   * X OAuth Client Secret
   * @default process.env.NUXT_OAUTH_X_CLIENT_SECRET
   */
  clientSecret?: string;
  /**
   * X OAuth Scope
   * @default []
   * @see https://developer.x.com/en/docs/authentication/oauth-2-0/user-access-token
   * @example ['tweet.read', 'users.read', 'offline.access'],
   */
  scope?: string[];

  /**
   * Require email from user
   * @default false
   */
  emailRequired?: boolean;

  /**
   * X OAuth Authorization URL
   * @default 'https://twitter.com/i/oauth2/authorize'
   */
  authorizationURL?: string;

  /**
   * X OAuth Token URL
   * @default 'https://api.twitter.com/2/oauth2/token'
   */
  tokenURL?: string;

  /**
   * X OAuth User URL
   * @default 'https://api.twitter.com/2/users/me'
   */
  userURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developer.x.com/en/docs/authentication/oauth-2-0/user-access-token
   */
  authorizationParams: Record<string, string>;
}

export interface XSUAAProps extends SSEProps {
  /**
   * XSUAA OAuth Client ID
   */
  clientId?: string;
  /**
   * XSUAA OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * XSUAA OAuth Issuer
   */
  domain?: string;
  /**
   * XSUAA OAuth Scope
   * @default []
   * @see https://sap.github.io/cloud-sdk/docs/java/guides/cloud-foundry-xsuaa-service
   * @example ['openid']
   */
  scope?: string[];
}

export interface YandexProps extends SSEProps {
  /**
   * Yandex OAuth Client ID
   */
  clientId?: string;

  /**
   * Yandex OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * Yandex OAuth Scope
   * @default []
   * @see https://yandex.ru/dev/id/doc/en/codes/code-url#optional
   * @example ["login:avatar", "login:birthday", "login:email", "login:info", "login:default_phone"]
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['login:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Yandex OAuth Authorization URL
   * @default 'https://oauth.yandex.ru/authorize'
   */
  authorizationURL?: string;

  /**
   * Yandex OAuth Token URL
   * @default 'https://oauth.yandex.ru/token'
   */
  tokenURL?: string;

  /**
   * Yandex OAuth User URL
   * @default 'https://login.yandex.ru/info'
   */
  userURL?: string;
}
