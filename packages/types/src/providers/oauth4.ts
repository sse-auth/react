import { Profile, TokenEndpointResponse } from "../types";

/**
 * JSON Object
 */
type JsonObject = { [Key in string]?: JsonValue };
/**
 * JSON Array
 */
type JsonArray = JsonValue[];
/**
 * JSON Primitives
 */
type JsonPrimitive = string | number | boolean | null;
/**
 * JSON Values
 */
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
const clockSkew: unique symbol = Symbol();
const clockTolerance: unique symbol = Symbol();

export type CryptoKey = Extract<
  Awaited<ReturnType<typeof crypto.subtle.generateKey>>,
  { type: string }
>;

export interface Client {
  /**
   * Client identifier.
   */
  client_id: string;
  /**
   * JWS `alg` algorithm required for signing the ID Token issued to this Client. When not
   * configured the default is to allow only algorithms listed in
   * {@link AuthorizationServer.id_token_signing_alg_values_supported `as.id_token_signing_alg_values_supported`}
   * and fall back to `RS256` when the authorization server metadata is not set.
   */
  id_token_signed_response_alg?: string;
  /**
   * JWS `alg` algorithm required for signing authorization responses. When not configured the
   * default is to allow only algorithms listed in
   * {@link AuthorizationServer.authorization_signing_alg_values_supported `as.authorization_signing_alg_values_supported`}
   * and fall back to `RS256` when the authorization server metadata is not set.
   */
  authorization_signed_response_alg?: string;
  /**
   * Boolean value specifying whether the {@link IDToken.auth_time `auth_time`} Claim in the ID Token
   * is REQUIRED. Default is `false`.
   */
  require_auth_time?: boolean;
  /**
   * JWS `alg` algorithm REQUIRED for signing UserInfo Responses. When not configured the default is
   * to allow only algorithms listed in
   * {@link AuthorizationServer.userinfo_signing_alg_values_supported `as.userinfo_signing_alg_values_supported`}
   * and fail otherwise.
   */
  userinfo_signed_response_alg?: string;
  /**
   * JWS `alg` algorithm REQUIRED for signed introspection responses. When not configured the
   * default is to allow only algorithms listed in
   * {@link AuthorizationServer.introspection_signing_alg_values_supported `as.introspection_signing_alg_values_supported`}
   * and fall back to `RS256` when the authorization server metadata is not set.
   */
  introspection_signed_response_alg?: string;
  /**
   * Default Maximum Authentication Age.
   */
  default_max_age?: number;

  /**
   * Indicates the requirement for a client to use mutual TLS endpoint aliases defined by the AS
   * where present. Default is `false`.
   *
   * When combined with {@link customFetch} (to use a Fetch API implementation that supports client
   * certificates) this can be used to target security profiles that utilize Mutual-TLS for either
   * client authentication or sender constraining.
   *
   * @example
   *
   * (Node.js) Using [nodejs/undici](https://github.com/nodejs/undici) for Mutual-TLS Client
   * Authentication and Certificate-Bound Access Tokens support.
   *
   * ```ts
   * import * as undici from 'undici'
   *
   * let as!: oauth.AuthorizationServer
   * let client!: oauth.Client & { use_mtls_endpoint_aliases: true }
   * let params!: URLSearchParams
   * let key!: string // PEM-encoded key
   * let cert!: string // PEM-encoded certificate
   *
   * let clientAuth = oauth.TlsClientAuth()
   * let agent = new undici.Agent({ connect: { key, cert } })
   *
   * let response = await oauth.pushedAuthorizationRequest(as, client, clientAuth, params, {
   *   // @ts-ignore
   *   [oauth.customFetch]: (...args) =>
   *     undici.fetch(args[0], { ...args[1], dispatcher: agent }),
   * })
   * ```
   *
   * @example
   *
   * (Deno) Using Deno.createHttpClient API for Mutual-TLS Client Authentication and
   * Certificate-Bound Access Tokens support.
   *
   * ```ts
   * let as!: oauth.AuthorizationServer
   * let client!: oauth.Client & { use_mtls_endpoint_aliases: true }
   * let params!: URLSearchParams
   * let key!: string // PEM-encoded key
   * let cert!: string // PEM-encoded certificate
   *
   * let clientAuth = oauth.TlsClientAuth()
   * // @ts-ignore
   * let agent = Deno.createHttpClient({ key, cert })
   *
   * let response = await oauth.pushedAuthorizationRequest(as, client, clientAuth, params, {
   *   // @ts-ignore
   *   [oauth.customFetch]: (...args) => fetch(args[0], { ...args[1], client: agent }),
   * })
   * ```
   *
   * @see [RFC 8705 - OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens](https://www.rfc-editor.org/rfc/rfc8705.html)
   */
  use_mtls_endpoint_aliases?: boolean;

  /**
   * See {@link clockSkew}.
   */
  [clockSkew]?: number;

  /**
   * See {@link clockTolerance}.
   */
  [clockTolerance]?: number;

  [metadata: string]: JsonValue | undefined;
}

export interface PrivateKey {
  /**
   * An asymmetric private CryptoKey.
   *
   * Its algorithm must be compatible with a supported {@link JWSAlgorithm JWS Algorithm}.
   */
  key: CryptoKey;

  /**
   * JWK Key ID to add to JOSE headers when this key is used. When not provided no `kid` (JWK Key
   * ID) will be added to the JOSE Header.
   */
  kid?: string;
}

interface OAuthProviderButtonStyles {
  logo?: string;
  /**
   * @deprecated
   */
  text?: string;
  /**
   * @deprecated Please use 'brandColor' instead
   */
  bg?: string;
  brandColor?: string;
}

type OAuthProviderType = "42-apple" | "apple" | "asgardeo";
type BuildInProviderType = OAuthProviderType;

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

export interface UserProps {
  [key: string]: any;
}

export type TokenSet = Partial<TokenEndpointResponse> & {
  /**
   * Date of when the `access_token` expires in seconds.
   * This value is calculated from the `expires_in` value.
   *
   * @see https://www.ietf.org/rfc/rfc6749.html#section-4.2.2
   */
  expires_at?: number;
};

export type ResponseProps<T extends UserProps = UserProps> = {
  error: Error | null | unknown;
  accessToken: TokenSet | null;
  userData: T | null;
  profile?: Profile;
};

export type LoginButtonProps<T, U extends UserProps = UserProps> = T & {
  onSuccess: (accessToken: TokenSet, userData: U, profile?: Profile) => void;
  onFailure: (error: Error) => void;
};

export type IconButtonProps<T, U extends UserProps = UserProps> = T & {
  onSuccess: (accessToken: TokenSet, userData: U, profile?: Profile) => void;
  onFailure: (error: Error) => void;
  icon?: React.ReactNode | string;
  variant?: string;
  className?: string;
};

export interface SSEGlobalProps {
  clientId?: string;
  clientSecret?: string;
}
