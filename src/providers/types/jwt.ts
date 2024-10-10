/**
 * JWT Actor - [RFC8693](https://www.rfc-editor.org/rfc/rfc8693.html#name-act-actor-claim).
 */
export interface ActJWTClaim {
  sub: string;
  [x: string]: unknown;
}
