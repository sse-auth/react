/** @see [Beyond Identity Developer Docs](https://developer.beyondidentity.com/) */
export interface BeyondIdentityProfile {
  /** The user's unique identifier. */
  sub: string;
  /** The user's full name. */
  name: string;
  /** The user's preferred username. */
  preferred_username: string;
  /** The user's email address. */
  email: string;
}
