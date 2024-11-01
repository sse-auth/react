import { SSEProps } from "./index";

export interface PaypalProps extends SSEProps {
  /**
   * PayPal Client ID
   */
  clientId?: string;

  /**
   * PayPal OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * PayPal OAuth Scope
   * @default []
   * @see https://developer.paypal.com/docs/log-in-with-paypal/integrate/reference/#scope-attributes
   * @example ['email', 'profile']
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Use PayPal sandbox environment
   * @default false // true in development, false in production
   */
  sandbox?: boolean;

  /**
   * PayPal OAuth Authorization URL
   * @default 'https://www.paypal.com/signin/authorize'
   */
  authorizationURL?: string;

  /**
   * PayPal OAuth Token URL
   * @default 'https://api-m.paypal.com/v1/oauth2/token'
   */
  tokenURL?: string;

  /**
   * Paypal OAuth User URL
   * @default 'https://api-m.paypal.com/v1/identity/openidconnect/userinfo'
   */
  userURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developer.paypal.com/docs/log-in-with-paypal/integrate/build-button/#link-constructauthorizationendpoint
   * @example { flowEntry: 'static' }
   */
  authorizationParams?: Record<string, string>;
}
