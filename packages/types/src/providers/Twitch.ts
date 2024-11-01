import { SSEProps } from "./index";

export interface TwitchProps extends SSEProps {
  /**
   * Twitch Client ID
   */
  clientId?: string;

  /**
   * Twitch OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * Twitch OAuth Scope
   * @default []
   * @see https://dev.twitch.tv/docs/authentication/scopes
   * @example ['user:read:email']
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['user:read:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Twitch OAuth Authorization URL
   * @default 'https://id.twitch.tv/oauth2/authorize'
   */
  authorizationURL?: string;

  /**
   * Twitch OAuth Token URL
   * @default 'https://id.twitch.tv/oauth2/token'
   */
  tokenURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
   * @example { force_verify: 'true' }
   */
  authorizationParams?: Record<string, string>;
}

export interface TwitchProfile extends Record<string, any> {
  sub: string;
  preferred_username: string;
  email: string;
  picture: string;
  [key: string]: any;
}
