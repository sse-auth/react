export interface Profile {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export type Awaitable<T> = T | PromiseLike<T>;
export type ProviderType = "oauth";

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
