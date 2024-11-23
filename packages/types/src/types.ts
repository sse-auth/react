import { Cookie } from "./utils";
import type {
  Adapter,
  AdapterSession,
  AdapterUser,
} from "@sse-auth/types/adapter";
import {
  CookieOption,
  CookiesOptions,
  JWT,
  JWTOptions,
} from "@sse-auth/types/utils";
// import { WebAuthnConfig, WebAuthnProviderType } from "../providers/webauthn";

type ProviderType = "email" | "oauth" | "oidc" | "webauthn";

export interface CredentialInput
  extends Partial<JSX.IntrinsicElements["input"]> {
  label?: string;
}

/**
 * Supported actions by Auth.js. Each action map to a REST API endpoint.
 * Some actions have a `GET` and `POST` variant, depending on if the action
 * changes the state of the server.
 *
 * - **`"callback"`**:
 *   - **`GET`**: Handles the callback from an [OAuth provider](https://authjs.dev/reference/core/providers#oauth2configprofile).
 *   - **`POST`**: Handles the callback from a [Credentials provider](https://authjs.dev/getting-started/providers/credentials#credentialsconfigcredentialsinputs).
 * - **`"csrf"`**: Returns the raw CSRF token, which is saved in a cookie (encrypted).
 * It is used for CSRF protection, implementing the [double submit cookie](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie) technique.
 * :::note
 * Some frameworks have built-in CSRF protection and can therefore disable this action. In this case, the corresponding endpoint will return a 404 response. Read more at [`skipCSRFCheck`](https://authjs.dev/reference/core#skipcsrfcheck).
 * _⚠ We don't recommend manually disabling CSRF protection, unless you know what you're doing._
 * :::
 * - **`"error"`**: Renders the built-in error page.
 * - **`"providers"`**: Returns a client-safe list of all configured providers.
 * - **`"session"`**:
 *   - **`GET`**: Returns the user's session if it exists, otherwise `null`.
 *   - **`POST`**: Updates the user's session and returns the updated session.
 * - **`"signin"`**:
 *   - **`GET`**: Renders the built-in sign-in page.
 *   - **`POST`**: Initiates the sign-in flow.
 * - **`"signout"`**:
 *   - **`GET`**: Renders the built-in sign-out page.
 *   - **`POST`**: Initiates the sign-out flow. This will invalidate the user's session (deleting the cookie, and if there is a session in the database, it will be deleted as well).
 * - **`"verify-request"`**: Renders the built-in verification request page.
 * - **`"webauthn-options"`**:
 *   - **`GET`**: Returns the options for the WebAuthn authentication and registration flows.
 */
export type AuthAction =
  | "callback"
  | "csrf"
  | "error"
  | "providers"
  | "session"
  | "signin"
  | "signout"
  | "verify-request"
  | "webauthn-options";

export interface SSE_User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface SSE_Profile {
  id?: string | null;
  sub?: string | null;
  name?: string | null;
  given_name?: string | null;
  family_name?: string | null;
  middle_name?: string | null;
  nickname?: string | null;
  preferred_username?: string | null;
  profile?: string | null;
  picture?: string | null | any;
  website?: string | null;
  email?: string | null;
  email_verified?: boolean | null;
  gender?: string | null;
  birthdate?: string | null;
  zoneinfo?: string | null;
  locale?: string | null;
  phone_number?: string | null;
  updated_at?: Date | string | number | null;
  address?: {
    formatted?: string | null;
    street_address?: string | null;
    locality?: string | null;
    region?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  [claim: string]: unknown;
}

export interface SSE_Account extends Partial<TokenEndpointResponse> {
  /** Provider's id for this account. E.g. "google". See the full list at https://authjs.dev/reference/core/providers */
  provider: string;
  /**
   * This value depends on the type of the provider being used to create the account.
   * - oauth/oidc: The OAuth account's id, returned from the `profile()` callback.
   * - email: The user's email address.
   * - credentials: `id` returned from the `authorize()` callback
   */
  providerAccountId: string;
  /** Provider's type for this account */
  type: ProviderType;
  /**
   * id of the user this account belongs to
   *
   * @see https://authjs.dev/reference/core/adapters#adapteruser
   */
  userId?: string;
  /**
   * Calculated value based on {@link TokenEndpointResponse.expires_in}.
   *
   * It is the absolute timestamp (in seconds) when the {@link TokenEndpointResponse.access_token} expires.
   *
   * This value can be used for implementing token rotation together with {@link TokenEndpointResponse.refresh_token}.
   *
   * @see https://authjs.dev/guides/refresh-token-rotation#database-strategy
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.1
   */
  expires_at?: number;
}

export interface AuthConfig {
  /**
   * A random string used to hash tokens, sign cookies and generate cryptographic keys.
   *
   * To generate a random string, you can use the Auth.js CLI: `npx auth secret`
   *
   * @note
   * You can also pass an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * The newer secret should be added to the start of the array, which will be used for all new sessions.
   *
   */
  secret?: string | string[];
  /**
   * Configure your session like if you want to use JWT or a database,
   * how long until an idle session expires, or to throttle write operations in case you are using a database.
   */
  session?: {
    /**
     * Choose how you want to save the user session.
     * The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
     *
     * If you use an `adapter` however, we default it to `"database"` instead.
     * You can still force a JWT session by explicitly defining `"jwt"`.
     *
     * When using `"database"`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     *
     * [Documentation](https://authjs.dev/reference/core#authconfig#session) | [Adapter](https://authjs.dev/reference/core#authconfig#adapter) | [About JSON Web Tokens](https://authjs.dev/concepts/session-strategies#jwt-session)
     */
    strategy?: "jwt" | "database";
    /**
     * Relative time from now in seconds when to expire the session
     *
     * @default 2592000 // 30 days
     */
    maxAge?: number;
    /**
     * How often the session should be updated in seconds.
     * If set to `0`, session is updated every time.
     *
     * @default 86400 // 1 day
     */
    updateAge?: number;
    /**
     * Generate a custom session token for database-based sessions.
     * By default, a random UUID or string is generated depending on the Node.js version.
     * However, you can specify your own custom string (such as CUID) to be used.
     *
     * @default `randomUUID` or `randomBytes.toHex` depending on the Node.js version
     */
    generateSessionToken?: () => string;
  };
  /**
   * JSON Web Tokens are enabled by default if you have not specified an {@link AuthConfig.adapter}.
   * JSON Web Tokens are encrypted (JWE) by default. We recommend you keep this behaviour.
   */
  jwt?: Partial<JWTOptions>;
  /**
   * Specify URLs to be used if you want to create custom sign in, sign out and error pages.
   * Pages specified will override the corresponding built-in page.
   *
   * @default {}
   * @example
   *
   * ```ts
   *   pages: {
   *     signIn: '/auth/signin',
   *     signOut: '/auth/signout',
   *     error: '/auth/error',
   *     verifyRequest: '/auth/verify-request',
   *     newUser: '/auth/new-user'
   *   }
   * ```
   */
  pages?: Partial<PagesOptions>;
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an action is performed.
   * Callbacks are *extremely powerful*, especially in scenarios involving JSON Web Tokens
   * as they **allow you to implement access controls without a database** and to **integrate with external databases or APIs**.
   */
  events?: {
    /**
     * If using a `credentials` type auth, the user is the raw response from your
     * credential provider.
     * For other providers, you'll get the SSE_User object from your adapter, the account,
     * and an indicator if the user was new to your Adapter.
     */
    signIn?: (message: {
      user: SSE_User;
      account?: SSE_Account | null;
      profile?: SSE_Profile;
      isNewUser?: boolean;
    }) => Awaitable<void>;
    /**
     * The message object will contain one of these depending on
     * if you use JWT or database persisted sessions:
     * - `token`: The JWT for this session.
     * - `session`: The session object from your adapter that is being ended.
     */
    signOut?: (
      message:
        | { session: Awaited<ReturnType<Required<Adapter>["deleteSession"]>> }
        | { token: Awaited<ReturnType<JWTOptions["decode"]>> }
    ) => Awaitable<void>;
    createUser?: (message: { user: SSE_User }) => Awaitable<void>;
    updateUser?: (message: { user: SSE_User }) => Awaitable<void>;
    linkAccount?: (message: {
      user: SSE_User | AdapterUser;
      account: SSE_Account;
      profile: SSE_User | AdapterUser;
    }) => Awaitable<void>;
    /**
     * The message object will contain one of these depending on
     * if you use JWT or database persisted sessions:
     * - `token`: The JWT for this session.
     * - `session`: The session object from your adapter.
     */
    session?: (message: { session: Session; token: JWT }) => Awaitable<void>;
  };
  /** You can use the adapter option to pass in your database adapter. */
  adapter?: Adapter;
  /** Changes the theme of built-in {@link AuthConfig.pages}. */
  theme?: Theme;
  /**
   * When set to `true` then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.
   * This option defaults to `false` on URLs that start with `http://` (e.g. http://localhost:3000) for developer convenience.
   * You can manually set this option to `false` to disable this security feature and allow cookies
   * to be accessible from non-secured URLs (this is not recommended).
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * The default is `false` HTTP and `true` for HTTPS sites.
   */
  useSecureCookies?: boolean;
  /**
   * You can override the default cookie names and options for any of the cookies used by Auth.js.
   * You can specify one or more cookies with custom properties
   * and missing options will use the default values defined by Auth.js.
   * If you use this feature, you will likely want to create conditional behavior
   * to support setting different cookies policies in development and production builds,
   * as you will be opting out of the built-in dynamic policy.
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * @default {}
   */
  cookies?: Partial<CookiesOptions>;
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an action is performed.
   * Callbacks are *extremely powerful*, especially in scenarios involving JSON Web Tokens
   * as they **allow you to implement access controls without a database** and to **integrate with external databases or APIs**.
   */
  callbacks?: {
    /**
     * Controls whether a user is allowed to sign in or not.
     * Returning `true` continues the sign-in flow.
     * Returning `false` or throwing an error will stop the sign-in flow and redirect the user to the error page.
     * Returning a string will redirect the user to the specified URL.
     *
     * Unhandled errors will throw an `AccessDenied` with the message set to the original error.
     *
     * [`AccessDenied`](https://authjs.dev/reference/core/errors#accessdenied)
     *
     * @example
     * ```ts
     * callbacks: {
     *  async signIn({ profile }) {
     *   // Only allow sign in for users with email addresses ending with "yourdomain.com"
     *   return profile?.email?.endsWith("@yourdomain.com")
     * }
     * ```
     */
    signIn?: (params: {
      user: SSE_User | AdapterUser;
      account?: SSE_Account | null;
      /**
       * If OAuth provider is used, it contains the full
       * OAuth profile returned by your provider.
       */
      profile?: SSE_Profile;
      /**
       * If Email provider is used, on the first call, it contains a
       * `verificationRequest: true` property to indicate it is being triggered in the verification request flow.
       * When the callback is invoked after a user has clicked on a sign in link,
       * this property will not be present. You can check for the `verificationRequest` property
       * to avoid sending emails to addresses or domains on a blocklist or to only explicitly generate them
       * for email address in an allow list.
       */
      email?: {
        verificationRequest?: boolean;
      };
      /** If Credentials provider is used, it contains the user credentials */
      credentials?: Record<string, CredentialInput>;
    }) => Awaitable<boolean | string>;
    /**
     * This callback is called anytime the user is redirected to a callback URL (i.e. on signin or signout).
     * By default only URLs on the same host as the origin are allowed.
     * You can use this callback to customise that behaviour.
     *
     * [Documentation](https://authjs.dev/reference/core/types#redirect)
     *
     * @example
     * callbacks: {
     *   async redirect({ url, baseUrl }) {
     *     // Allows relative callback URLs
     *     if (url.startsWith("/")) return `${baseUrl}${url}`
     *
     *     // Allows callback URLs on the same origin
     *     if (new URL(url).origin === baseUrl) return url
     *
     *     return baseUrl
     *   }
     * }
     */
    redirect?: (params: {
      /** URL provided as callback URL by the client */
      url: string;
      /** Default base URL of site (can be used as fallback) */
      baseUrl: string;
    }) => Awaitable<string>;
    /**
     * This callback is called whenever a session is checked.
     * (i.e. when invoking the `/api/session` endpoint, using `useSession` or `getSession`).
     * The return value will be exposed to the client, so be careful what you return here!
     * If you want to make anything available to the client which you've added to the token
     * through the JWT callback, you have to explicitly return it here as well.
     *
     * :::note
     * ⚠ By default, only a subset (email, name, image)
     * of the token is returned for increased security.
     * :::
     *
     * The token argument is only available when using the jwt session strategy, and the
     * user argument is only available when using the database session strategy.
     *
     * [`jwt` callback](https://authjs.dev/reference/core/types#jwt)
     *
     * @example
     * ```ts
     * callbacks: {
     *   async session({ session, token, user }) {
     *     // Send properties to the client, like an access_token from a provider.
     *     session.accessToken = token.accessToken
     *
     *     return session
     *   }
     * }
     * ```
     */
    session?: (
      params: ({
        session: { user: AdapterUser } & AdapterSession;
        /** Available when {@link AuthConfig.session} is set to `strategy: "database"`. */
        user: AdapterUser;
      } & {
        session: Session;
        /** Available when {@link AuthConfig.session} is set to `strategy: "jwt"` */
        token: JWT;
      }) & {
        /**
         * Available when using {@link AuthConfig.session} `strategy: "database"` and an update is triggered for the session.
         *
         * :::note
         * You should validate this data before using it.
         * :::
         */
        newSession: any;
        trigger?: "update";
      }
    ) => Awaitable<Session | DefaultSession>;
    /**
     * This callback is called whenever a JSON Web Token is created (i.e. at sign in)
     * or updated (i.e whenever a session is accessed in the client). Anything you
     * return here will be saved in the JWT and forwarded to the session callback.
     * There you can control what should be returned to the client. Anything else
     * will be kept from your frontend. The JWT is encrypted by default via your
     * AUTH_SECRET environment variable.
     *
     * [`session` callback](https://authjs.dev/reference/core/types#session)
     */
    jwt?: (params: {
      /**
       * When `trigger` is `"signIn"` or `"signUp"`, it will be a subset of {@link JWT},
       * `name`, `email` and `image` will be included.
       *
       * Otherwise, it will be the full {@link JWT} for subsequent calls.
       */
      token: JWT;
      /**
       * Either the result of the {@link OAuthConfig.profile} or the {@link CredentialsConfig.authorize} callback.
       * @note available when `trigger` is `"signIn"` or `"signUp"`.
       *
       * Resources:
       * - [Credentials Provider](https://authjs.dev/getting-started/authentication/credentials)
       * - [User database model](https://authjs.dev/guides/creating-a-database-adapter#user-management)
       */
      user: SSE_User | AdapterUser;
      /**
       * Contains information about the provider that was used to sign in.
       * Also includes {@link TokenSet}
       * @note available when `trigger` is `"signIn"` or `"signUp"`
       */
      account?: SSE_Account | null;
      /**
       * The OAuth profile returned from your provider.
       * (In case of OIDC it will be the decoded ID Token or /userinfo response)
       * @note available when `trigger` is `"signIn"`.
       */
      profile?: SSE_Profile;
      /**
       * Check why was the jwt callback invoked. Possible reasons are:
       * - user sign-in: First time the callback is invoked, `user`, `profile` and `account` will be present.
       * - user sign-up: a user is created for the first time in the database (when {@link AuthConfig.session}.strategy is set to `"database"`)
       * - update event: Triggered by the `useSession().update` method.
       * In case of the latter, `trigger` will be `undefined`.
       */
      trigger?: "signIn" | "signUp" | "update";
      /** @deprecated use `trigger === "signUp"` instead */
      isNewUser?: boolean;
      /**
       * When using {@link AuthConfig.session} `strategy: "jwt"`, this is the data
       * sent from the client via the `useSession().update` method.
       *
       * ⚠ Note, you should validate this data before using it.
       */
      session?: any;
    }) => Awaitable<JWT | null>;
  };
}

/** @internal */
export type InternalProvider<T = ProviderType> = T extends WebAuthnProviderType
  ? WebAuthnConfig
  : T;

export interface InternalOptions<TProviderType = ProviderType> {
  url: URL;
  secret: string | string[];
  theme: Theme;
  debug: boolean;
  provider: InternalProvider<TProviderType>;
  pages: Partial<PagesOptions>;
  session: NonNullable<Required<AuthConfig["session"]>>;
  events: NonNullable<AuthConfig["events"]>;
  jwt: JWTOptions;
  adapter: Required<Adapter> | undefined;
  cookies: Record<keyof CookiesOptions, CookieOption>;
  basePath: string;
  callbacks: NonNullable<Required<AuthConfig["callbacks"]>>;
  callbackUrl: string;
}

type ISODateString = string;

export interface Profile {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export type Awaitable<T> = T | PromiseLike<T>;
export type Awaited<T> = T extends Promise<infer U> ? U : T;
// export type ProviderType = "oauth" | "webauthn";

export type JsonObject = { [Key in string]?: JsonValue };
export type JsonArray = JsonValue[];
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface Authenticator {
  /**
   * ID of the user this authenticator belongs to.
   */
  userId?: string;
  /**
   * The provider account ID connected to the authenticator.
   */
  providerAccountId: string;
  /**
   * Number of times the authenticator has been used.
   */
  counter: number;
  /**
   * Whether the client authenticator backed up the credential.
   */
  credentialBackedUp: boolean;
  /**
   * Base64 encoded credential ID.
   */
  credentialID: string;
  /**
   * Base64 encoded credential public key.
   */
  credentialPublicKey: string;
  /**
   * Concatenated transport flags.
   */
  transports?: string | null;
  /**
   * Device type of the authenticator.
   */
  credentialDeviceType: string;
}

export interface AuthorizationDetails {
  readonly type: string;
  readonly locations?: string[];
  readonly actions?: string[];
  readonly datatypes?: string[];
  readonly privileges?: string[];
  readonly identifier?: string;
  readonly [parameter: string]: JsonValue | undefined;
}

export interface TokenEndpointResponse {
  readonly access_token: string;
  readonly expires_in?: number;
  readonly id_token?: string;
  readonly refresh_token?: string;
  readonly scope?: string;
  readonly authorization_details?: AuthorizationDetails[];
  /**
   * NOTE: because the value is case insensitive it is always returned lowercased
   */
  readonly token_type: "bearer" | "dpop" | Lowercase<string>;
  readonly [parameter: string]: JsonValue | undefined;
}

export interface ResponseInternal<
  Body extends string | Record<string, any> | any[] | null = any
> {
  status?: number;
  headers?: Headers | HeadersInit;
  body?: Body;
  redirect?: string;
  cookies?: Cookie[];
}

export interface RequestInternal {
  url: URL;
  method: "GET" | "POST";
  cookies?: Partial<Record<string, string>>;
  headers?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  // action: AuthAction;
  providerId?: string;
  error?: string;
}

export interface RequestInternal {
  url: URL;
  method: "GET" | "POST";
  cookies?: Partial<Record<string, string>>;
  headers?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  action: AuthAction;
  providerId?: string;
  error?: string;
}

export interface Theme {
  colorScheme?: "auto" | "dark" | "light";
  logo?: string;
  brandColor?: string;
  buttonText?: string;
}

export interface PagesOptions {
  /**
   * The path to the sign in page.
   *
   * The optional "error" query parameter is set to
   * one of the {@link SignInPageErrorParam available} values.
   *
   * @default "/signin"
   */
  signIn?: string;
  signOut?: string;
  /**
   * The path to the error page.
   *
   * The optional "error" query parameter is set to
   * one of the {@link ErrorPageParam available} values.
   *
   * @default "/error"
   */
  error?: string;
  verifyRequest?: string;
  /** If set, new users will be directed here on first sign in */
  newUser?: string;
}

export interface DefaultSession {
  user?: Profile;
  expires: ISODateString;
}

export interface Session extends DefaultSession {}

export type SemverString =
  | `v${number}`
  | `v${number}.${number}`
  | `v${number}.${number}.${number}`;
