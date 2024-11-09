export interface AtlassianProfile extends Record<string, any> {
  /**
   * The user's atlassian account ID
   */
  account_id: string;
  /**
   * The user name
   */
  name: string;
  /**
   * The user's email
   */
  email: string;
  /**
   * The user's profile picture
   */
  picture: string;
}
