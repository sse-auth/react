import { SSEProps } from "./index";

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

export interface Auth0Profile extends Record<string, any> {
  /** The user's unique identifier. */
  sub?: string;
  /** Custom fields that store info about a user that influences the user's access, such as support plan, security roles (if not using the Authorization Core feature set), or access control groups. To learn more, read Metadata Overview. */
  app_metadata?: object;
  /** Indicates whether the user has been blocked. Importing enables subscribers to ensure that users remain blocked when migrating to Auth0. */
  blocked?: boolean;
  /** Timestamp indicating when the user profile was first created. */
  created_at?: Date;
  /** (unique) The user's email address. */
  email?: string;
  /** Indicates whether the user has verified their email address. */
  email_verified?: boolean;
  /** The user's family name. */
  family_name?: string;
  /** The user's given name. */
  given_name?: string;
  /** Custom fields that store info about a user that does not impact what they can or cannot access, such as work address, home address, or user preferences. To learn more, read Metadata Overview. */
  user_metadata?: object;
  /** (unique) The user's username. */
  username?: string;
  /** Contains info retrieved from the identity provider with which the user originally authenticates. Users may also link their profile to multiple identity providers; those identities will then also appear in this array. The contents of an individual identity provider object varies by provider. In some cases, it will also include an API Access Token to be used with the provider. */
  identities?: Array<{
    /** Name of the Auth0 connection used to authenticate the user. */
    connection?: string;
    /** Indicates whether the connection is a social one. */
    isSocial?: boolean;
    /** Name of the entity that is authenticating the user, such as Facebook, Google, SAML, or your own provider. */
    provider?: string;
    /** User's unique identifier for this connection/provider. */
    user_id?: string;
    /** User info associated with the connection. When profiles are linked, it is populated with the associated user info for secondary accounts. */
    profileData?: object;
    [key: string]: any;
  }>;
  /** IP address associated with the user's last login. */
  last_ip?: string;
  /** Timestamp indicating when the user last logged in. If a user is blocked and logs in, the blocked session updates last_login. If you are using this property from inside a Rule using the user< object, its value will be associated with the login that triggered the rule; this is because rules execute after login. */
  last_login?: Date;
  /** Timestamp indicating the last time the user's password was reset/changed. At user creation, this field does not exist. This property is only available for Database connections. */
  last_password_reset?: Date;
  /** Number of times the user has logged in. If a user is blocked and logs in, the blocked session is counted in logins_count. */
  logins_count?: number;
  /** List of multi-factor providers with which the user is enrolled. */
  multifactor?: string;
  /** The user's full name. */
  name?: string;
  /** The user's nickname. */
  nickname?: string;
  /** The user's phone number. Only valid for users with SMS connections. */
  phone_number?: string;
  /** Indicates whether the user has been verified their phone number. Only valid for users with SMS connections. */
  phone_verified?: boolean;
  /** URL pointing to the user's profile picture. */
  picture?: string;
  /** Timestamp indicating when the user's profile was last updated/modified. Changes to last_login are considered updates, so most of the time, updated_at will match last_login. */
  updated_at?: Date;
  /** (unique) The user's identifier. Importing allows user records to be synchronized across multiple systems without using mapping tables. */
  user_id?: string;
}
