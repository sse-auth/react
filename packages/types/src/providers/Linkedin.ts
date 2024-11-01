import { SSEProps } from "./index";

export interface LinkedInProps extends SSEProps {
  /**
   * LinkedIn OAuth Client ID
   */
  clientId?: string;
  /**
   * LinkedIn OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * LinkedIn OAuth Scope
   * @default ['openid', 'profile', 'email']
   * @example ['openid', 'profile']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * LinkedIn OAuth Authorization URL
   * @default 'https://www.linkedin.com/oauth/v2/authorization'
   */
  authorizationURL?: string;
  /**
   * LinkedIn OAuth Token URL
   * @default 'https://www.linkedin.com/oauth/v2/accessToken'
   */
  tokenURL?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin/context
   */
  authorizationParams?: Record<string, string>;
}

export interface LinkedInProfile extends Record<string, any> {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  email?: string;
  email_verified?: boolean;
  [key: string]: any;
}
