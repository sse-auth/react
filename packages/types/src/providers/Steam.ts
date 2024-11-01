import { SSEProps } from "./index";

export interface SteamProps extends SSEProps {
  /**
   * Steam API Key
   * @see https://steamcommunity.com/dev
   */
  apiKey?: string;

  /**
   * Steam Open ID OAuth Authorization URL
   * @default 'https://steamcommunity.com/openid/login'
   */
  authorizationURL?: string;
}
