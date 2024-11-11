export * from "./context";
export * from "./font";

import { Adapter } from "../adapter";
import { CookiesOptions, JWTOptions } from "../utils";
import { ProviderContextMap } from "./context";

interface Theme {
  colorScheme?: "auto" | "dark" | "light";
  logo?: string;
  brandColor?: string;
  buttonText?: string;
}

interface PagesOptions {
  /**
   * The path to the sign in page.
   *
   * The optional "error" query parameter is set to
   * one of the {@link SignInPageErrorParam available} values.
   *
   * @default "/signin"
   */
  signIn: string;
  signOut: string;
  /**
   * The path to the error page.
   *
   * The optional "error" query parameter is set to
   * one of the {@link ErrorPageParam available} values.
   *
   * @default "/error"
   */
  error: string;
  verifyRequest: string;
  /** If set, new users will be directed here on first sign in */
  newUser: string;
}

export interface ProviderConfig {
  /**
   * List of authentication providers for signing in
   * (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
   * This can be one of the built-in providers or an object with a custom provider.
   *
   * @default []
   */
  providers: ProviderContextMap;
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
  //   callbacks?: {}

  /**
   * Events are asynchronous functions that do not return a response, they are useful for audit logging.
   * You can specify a handler for any of these events below - e.g. for debugging or to create an audit log.
   * The content of the message object varies depending on the flow
   * (e.g. OAuth or Email authentication flow, JWT or database sessions, etc),
   * but typically contains a user object and/or contents of the JSON Web Token
   * and other information relevant to the event.
   *
   * @default {}
   */
  //   events?: {
  //     /**
  //      * If using a `credentials` type auth, the user is the raw response from your
  //      * credential provider.
  //      * For other providers, you'll get the User object from your adapter, the account,
  //      * and an indicator if the user was new to your Adapter.
  //      */
  //     signIn?: (message: {
  //       user: User;
  //       account?: Account | null;
  //       profile?: Profile;
  //       isNewUser?: boolean;
  //     }) => Awaitable<void>;
  //     /**
  //      * The message object will contain one of these depending on
  //      * if you use JWT or database persisted sessions:
  //      * - `token`: The JWT for this session.
  //      * - `session`: The session object from your adapter that is being ended.
  //      */
  //     signOut?: (
  //       message:
  //         | { session: Awaited<ReturnType<Required<Adapter>["deleteSession"]>> }
  //         | { token: Awaited<ReturnType<JWTOptions["decode"]>> }
  //     ) => Awaitable<void>;
  //     createUser?: (message: { user: User }) => Awaitable<void>;
  //     updateUser?: (message: { user: User }) => Awaitable<void>;
  //     linkAccount?: (message: {
  //       user: User | AdapterUser;
  //       account: Account;
  //       profile: User | AdapterUser;
  //     }) => Awaitable<void>;
  //     /**
  //      * The message object will contain one of these depending on
  //      * if you use JWT or database persisted sessions:
  //      * - `token`: The JWT for this session.
  //      * - `session`: The session object from your adapter.
  //      */
  //     session?: (message: { session: Session; token: JWT }) => Awaitable<void>;
  //   };

  /** You can use the adapter option to pass in your database adapter. */
  adapters?: Adapter;
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
   * Auth.js relies on the incoming request's `host` header to function correctly. For this reason this property needs to be set to `true`.
   *
   * Make sure that your deployment platform sets the `host` header safely.
   *
   * :::note
   * Official Auth.js-based libraries will attempt to set this value automatically for some deployment platforms (eg.: Vercel) that are known to set the `host` header safely.
   * :::
   */
  trustHost?: boolean;
  /**
   * The base path of the Auth.js API endpoints.
   *
   * @default "/" in "next-auth"; "/auth" with all other frameworks
   */
  //   basePath?: string;
}
