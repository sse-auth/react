export type BattledotnetProps = {
  /**
   * Battle.net OAuth Client ID
   */
  clientId?: string;
  /**
   * Battle.net OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Battle.net OAuth Scope
   * @default []
   * @see https://develop.battle.net/documentation/guides/using-oauth
   * @example ['openid', 'wow.profile', 'sc2.profile', 'd3.profile']
   */
  scope?: string[];
  /**
   * Battle.net OAuth Region
   * @default EU
   * @see https://develop.battle.net/documentation/guides/using-oauth
   * @example EU (possible values: US, EU, APAC)
   */
  region?: string;
  /**
   * Battle.net OAuth Authorization URL
   * @default 'https://oauth.battle.net/authorize'
   */
  // authorizationURL?: string;
  /**
   * Battle.net OAuth Token URL
   * @default 'https://oauth.battle.net/token'
   */
  // tokenURL?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://develop.battle.net/documentation/guides/using-oauth/authorization-code-flow
   */
  authorizationParams?: Record<string, string>;
  /** */
  redirectUri?: string;
};

export interface BattleDotNetLoginButtonProps extends BattledotnetProps {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
}

export type BattleDotNetIconButtonProps = BattledotnetProps & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
  //   icon: IconProps["icon"];
  icon: React.ReactNode | string;
  variant?: string;
  className?: string;
};
