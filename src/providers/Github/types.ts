// import { IconProps } from "../../components";

export type GithubProps = {
  /**
   * GitHub OAuth Client ID
   */
  clientId?: string;
  /**
   * GitHub OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * GitHub OAuth Scope
   * @default []
   * @see https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
   * @example ['user:email']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['user:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * GitHub OAuth Authorization URL
   * @default 'https://github.com/login/oauth/authorize'
   */
  authorizationURL?: string;

  /**
   * GitHub OAuth Token URL
   * @default 'https://github.com/login/oauth/access_token'
   */
  tokenURL?: string;

  /**
   * GitHub OAuth Token URL
   * @default 'https://api.github.com/user'
   */
  userUrl?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
   * @example { allow_signup: 'true' }
   */
  authorizationParams?: Record<string, string>;
};

export interface GithubLoginButtonProps extends GithubProps {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
}

export type GithubIconButtonProps = GithubProps & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
  //   icon: IconProps["icon"];
  icon: React.ReactNode | string;
  variant?: string;
  className?: string;
};
