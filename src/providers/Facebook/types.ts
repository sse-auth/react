export type FacebookProps = {
  /**
   * Facebook OAuth Client ID
   */
  clientId?: string;
  /**
   * Facebook OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Facebook OAuth Scope
   * @default []
   * @see https://developers.facebook.com/docs/permissions
   * @example [ 'email' ],
   */
  scope?: string[];

  /**
   * Facebook OAuth User Fields
   * @default [ 'id', 'name'],
   * @see https://developers.facebook.com/docs/graph-api/guides/field-expansion
   * @example [ 'id', 'name', 'email' ],
   */
  fields?: string[];

  /**
   * Facebook OAuth Authorization URL
   * @default 'https://www.facebook.com/v19.0/dialog/oauth'
   */
  authorizationURL?: string;

  /**
   * GitHub OAuth Token URL
   * @default 'https://graph.facebook.com/v19.0/me'
   */
  userUrl?: string;

  /**
   * Facebook OAuth Token URL
   * @default 'https://graph.facebook.com/v19.0/oauth/access_token'
   */
  tokenURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow/
   */
  authorizationParams?: Record<string, string>;

  /** */
  redirectUri?: string;
};

export interface FacebookLoginButtonProps extends FacebookProps {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
}

export type FacebookIconButtonProps = FacebookProps & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
  //   icon: IconProps["icon"];
  icon?: React.ReactNode | string;
  variant?: string;
  className?: string;
};
