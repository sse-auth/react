/** The returned user profile from Descope when using the profile callback.
 * [See Load User](https://docs.descope.com/api/openapi/usermanagement/operation/LoadUser/)
 */
export interface DescopeProfile {
  /** The user's unique Descope ID */
  sub: string;
  /** The user's name */
  name: string;
  /** The user's email */
  email: string;
  /** A boolean indicating if the user's email is verified */
  email_verified: boolean;
  /** The user's phone number */
  phone_number: string;
  /** A boolean indicating if the user's phone number is verified */
  phone_number_verified: boolean;
  /** The user's picture */
  picture: string;
  /** The user's custom attributes */
  [claim: string]: unknown;
}
