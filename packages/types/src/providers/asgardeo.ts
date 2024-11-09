export interface AsgardeoProfile extends Record<string, any> {
  /**
   * The user Asgardeo account ID
   */
  sub: string;
  /**
   * The user name
   */
  given_name: string;
  /**
   * The user email
   */
  email: string;
  /**
   * The user profile picture
   */
  picture: string;
}
