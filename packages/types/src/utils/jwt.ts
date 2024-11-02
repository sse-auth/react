import { Awaitable, LoggerInstance } from "./index";

export interface DefaultJWT extends Record<string, unknown> {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
  [key: string]: any;
}

export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface JWTEncodeParams<Payload = JWT> {
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge?: number;
  /** Used in combination with `secret`, to derive the encryption secret for JWTs. */
  salt: string;
  /** Used in combination with `salt`, to derive the encryption secret for JWTs. */
  secret: string | string[];
  /** The JWT payload. */
  token?: Payload;
}

export interface JWTDecodeParams {
  /** Used in combination with `secret`, to derive the encryption secret for JWTs. */
  salt: string;
  /**
   * Used in combination with `salt`, to derive the encryption secret for JWTs.
   *
   * @note
   * You can also pass an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * The newer secret should be added to the start of the array, which will be used for all new sessions.
   */
  secret: string | string[];
  /** The Auth.js issued JWT to be decoded */
  token?: string;
}

export interface JWTOptions {
  /**
   * The secret used to encode/decode the Auth.js issued JWT.
   * It can be an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * @internal
   */
  secret: string | string[];
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge: number;
  /** Override this method to control the Auth.js issued JWT encoding. */
  encode: (params: JWTEncodeParams) => Awaitable<string>;
  /** Override this method to control the Auth.js issued JWT decoding. */
  decode: (params: JWTDecodeParams) => Awaitable<JWT | null>;
}

type GetTokenParamsBase = {
  secret?: JWTDecodeParams["secret"];
  salt?: JWTDecodeParams["salt"];
};

export interface GetTokenParams<R extends boolean = false>
  extends GetTokenParamsBase {
  /** The request containing the JWT either in the cookies or in the `Authorization` header. */
  req: Request | { headers: Headers | Record<string, string> };
  /**
   * Use secure prefix for cookie name, unless URL in `NEXTAUTH_URL` is http://
   * or not set (e.g. development or test instance) case use unprefixed name
   */
  secureCookie?: boolean;
  /** If the JWT is in the cookie, what name `getToken()` should look for. */
  cookieName?: string;
  /**
   * `getToken()` will return the raw JWT if this is set to `true`
   *
   * @default false
   */
  raw?: R;
  decode?: JWTOptions["decode"];
  logger?: LoggerInstance | Console;
}
