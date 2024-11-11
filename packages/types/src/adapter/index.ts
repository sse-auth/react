import { Awaitable, ProviderType, Profile, TokenEndpointResponse, Authenticator } from "../types";

export interface Account extends Partial<TokenEndpointResponse> {
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

export interface AdapterUser extends Profile {
  /** A unique identifier for the user. */
  id: string;
  /** The user's email address. */
  email: string;
  /**
   * Whether the user has verified their email address via an [Email provider](https://sse-auth.github.io/getting-started/authentication/email).
   * It is `null` if the user has not signed in with the Email provider yet, or the date of the first successful signin.
   */
  emailVerified: Date | null;
}

export type AdapterAccountType = Extract<
  ProviderType,
  "oauth" | "oidc" | "email" | "webauthn"
>;

export interface AdapterAccount extends Account {
  userId: string;
  type: AdapterAccountType;
}

/**
 * A session holds information about a user's current signin state.
 */
export interface AdapterSession {
  /**
   * A randomly generated value that is used to look up the session in the database
   * when using `"database"` `AuthConfig.strategy` option.
   * This value is saved in a secure, HTTP-Only cookie on the client.
   */
  sessionToken: string;
  /** Connects the active session to a user in the database */
  userId: string;
  /**
   * The absolute date when the session expires.
   *
   * If a session is accessed prior to its expiry date,
   * it will be extended based on the `maxAge` option as defined in by `SessionOptions.maxAge`.
   * It is never extended more than once in a period defined by `SessionOptions.updateAge`.
   *
   * If a session is accessed past its expiry date,
   * it will be removed from the database to clean up inactive sessions.
   *
   */
  expires: Date;
}

/**
 * A verification token is a temporary token that is used to sign in a user via their email address.
 * It is created when a user signs in with an [Email provider](https://sse-auth.github.io/getting-started/authentication/email).
 * When the user clicks the link in the email, the token and email is sent back to the server
 * where it is hashed and compared to the value in the database.
 * If the tokens and emails match, and the token hasn't expired yet, the user is signed in.
 * The token is then deleted from the database.
 */
export interface VerificationToken {
  /** The user's email address. */
  identifier: string;
  /** The absolute date when the token expires. */
  expires: Date;
  /**
   * A [hashed](https://en.wikipedia.org/wiki/Hash_function) token, using the `AuthConfig.secret` value.
   */
  token: string;
}

/**
 * An authenticator represents a credential authenticator assigned to a user.
 */
export interface AdapterAuthenticator extends Authenticator {
  /**
   * User ID of the authenticator.
   */
  userId: string;
}

/**
 * An adapter is an object with function properties (methods) that read and write data from a data source.
 * Think of these methods as a way to normalize the data layer to common interfaces that Auth.js can understand.
 *
 * This is what makes Auth.js very flexible and allows it to be used with any data layer.
 *
 * The adapter methods are used to perform the following operations:
 * - Create/update/delete a user
 * - Link/unlink an account to/from a user
 * - Handle active sessions
 * - Support passwordless authentication across multiple devices
 *
 * :::note
 * If any of the methods are not implemented, but are called by Auth.js,
 * an error will be shown to the user and the operation will fail.
 * :::
 */

export interface Adapter {
  /**
   * Creates a user in the database and returns it.
   *
   * See also [User management](https://sse-auth.github.io/guides/creating-a-database-adapter#user-management)
   */
  createUser?(user: AdapterUser): Awaitable<AdapterUser>;
  /**
   * Returns a user from the database via the user id.
   *
   * See also [User management](https://sse-auth.github.io/guides/creating-a-database-adapter#user-management)
   */
  getUser?(id: string): Awaitable<AdapterUser | null>;
  /**
   * Returns a user from the database via the user's email address.
   *
   * See also [Verification tokens](https://sse-auth.github.io/guides/creating-a-database-adapter#verification-tokens)
   */
  getUserByEmail?(email: string): Awaitable<AdapterUser | null>;
  /**
   * Using the provider id and the id of the user for a specific account, get the user.
   *
   * See also [User management](https://sse-auth.github.io/guides/creating-a-database-adapter#user-management)
   */
  getUserByAccount?(
    providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
  ): Awaitable<AdapterUser | null>;
  /**
   * Updates a user in the database and returns it.
   *
   * See also [User management](https://sse-auth.github.io/guides/creating-a-database-adapter#user-management)
   */
  updateUser?(
    user: Partial<AdapterUser> & Pick<AdapterUser, "id">
  ): Awaitable<AdapterUser>;
  /**
   * @todo This method is currently not invoked yet.
   *
   * See also [User management](https://sse-auth.github.io/guides/creating-a-database-adapter#user-management)
   */
  deleteUser?(
    userId: string
  ): Promise<void> | Awaitable<AdapterUser | null | undefined>;
  /**
   * This method is invoked internally (but optionally can be used for manual linking).
   * It creates an [Account](https://sse-auth.github.io/reference/core/adapters#models) in the database.
   *
   * See also [User management](https://sse-auth.github.io/guides/creating-a-database-adapter#user-management)
   */
  linkAccount?(
    account: AdapterAccount
  ): Promise<void> | Awaitable<AdapterAccount | null | undefined>;
  /** @todo This method is currently not invoked yet. */
  unlinkAccount?(
    providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
  ): Promise<void> | Awaitable<AdapterAccount | undefined>;
  /**
   * Creates a session for the user and returns it.
   *
   * See also [Database Session management](https://sse-auth.github.io/guides/creating-a-database-adapter#database-session-management)
   */
  createSession?(session: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }): Awaitable<AdapterSession>;
  /**
   * Returns a session and a userfrom the database in one go.
   *
   * :::tip
   * If the database supports joins, it's recommended to reduce the number of database queries.
   * :::
   *
   * See also [Database Session management](https://sse-auth.github.io/guides/creating-a-database-adapter#database-session-management)
   */
  getSessionAndUser?(
    sessionToken: string
  ): Awaitable<{ session: AdapterSession; user: AdapterUser } | null>;
  /**
   * Updates a session in the database and returns it.
   *
   * See also [Database Session management](https://sse-auth.github.io/guides/creating-a-database-adapter#database-session-management)
   */
  updateSession?(
    session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
  ): Awaitable<AdapterSession | null | undefined>;
  /**
   * Deletes a session from the database. It is preferred that this method also
   * returns the session that is being deleted for logging purposes.
   *
   * See also [Database Session management](https://sse-auth.github.io/guides/creating-a-database-adapter#database-session-management)
   */
  deleteSession?(
    sessionToken: string
  ): Promise<void> | Awaitable<AdapterSession | null | undefined>;
  /**
   * Creates a verification token and returns it.
   *
   * See also [Verification tokens](https://sse-auth.github.io/guides/creating-a-database-adapter#verification-tokens)
   */
  createVerificationToken?(
    verificationToken: VerificationToken
  ): Awaitable<VerificationToken | null | undefined>;
  /**
   * Return verification token from the database and deletes it
   * so it can only be used once.
   *
   * See also [Verification tokens](https://sse-auth.github.io/guides/creating-a-database-adapter#verification-tokens)
   */
  useVerificationToken?(params: {
    identifier: string;
    token: string;
  }): Awaitable<VerificationToken | null>;
  /**
   * Get account by provider account id and provider.
   *
   * If an account is not found, the adapter must return `null`.
   */
  getAccount?(
    providerAccountId: AdapterAccount["providerAccountId"],
    provider: AdapterAccount["provider"]
  ): Awaitable<AdapterAccount | null>;
  /**
   * Returns an authenticator from its credentialID.
   *
   * If an authenticator is not found, the adapter must return `null`.
   */
  getAuthenticator?(
    credentialID: AdapterAuthenticator["credentialID"]
  ): Awaitable<AdapterAuthenticator | null>;
  /**
   * Create a new authenticator.
   *
   * If the creation fails, the adapter must throw an error.
   */
  createAuthenticator?(
    authenticator: AdapterAuthenticator
  ): Awaitable<AdapterAuthenticator>;
  /**
   * Returns all authenticators from a user.
   *
   * If a user is not found, the adapter should still return an empty array.
   * If the retrieval fails for some other reason, the adapter must throw an error.
   */
  listAuthenticatorsByUserId?(
    userId: AdapterAuthenticator["userId"]
  ): Awaitable<AdapterAuthenticator[]>;
  /**
   * Updates an authenticator's counter.
   *
   * If the update fails, the adapter must throw an error.
   */
  updateAuthenticatorCounter?(
    credentialID: AdapterAuthenticator["credentialID"],
    newCounter: AdapterAuthenticator["counter"]
  ): Awaitable<AdapterAuthenticator>;
}
