import { SSEProps } from "./index";

export interface SpotifyProps extends SSEProps {
  /**
   * Spotify OAuth Client ID
   */
  clientId?: string;
  /**
   * Spotify OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Spotify OAuth Scope
   * @default []
   * @see https://developer.spotify.com/documentation/web-api/concepts/scopes
   * @example ['user-read-email']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['user-read-email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Spotify OAuth Authorization URL
   * @default 'https://accounts.spotify.com/authorize'
   */
  authorizationURL?: string;

  /**
   * Spotify OAuth Token URL
   * @default 'https://accounts.spotify.com/api/token'
   */
  tokenURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see 'https://developer.spotify.com/documentation/web-api/tutorials/code-flow'
   * @example { show_dialog: 'true' }
   */
  authorizationParams?: Record<string, string>;

  /**
   * direct redirection or not
   * @default false
   */
  show_dialog?: boolean;
}

interface SpotifyImage {
  url: string;
}

export interface SpotifyProfile extends Record<string, any> {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
  [key: string]: any;
}
