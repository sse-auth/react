import { TokenEndpointResponse } from "./types";

export * from "./context";
export * from "./providers";
export * from "./types";

type ProviderType = "oauth";

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
