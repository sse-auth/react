import { SSEProps } from "./index";

export interface XSUAAProps extends SSEProps {
  /**
   * XSUAA OAuth Client ID
   */
  clientId?: string;
  /**
   * XSUAA OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * XSUAA OAuth Issuer
   */
  domain?: string;
  /**
   * XSUAA OAuth Scope
   * @default []
   * @see https://sap.github.io/cloud-sdk/docs/java/guides/cloud-foundry-xsuaa-service
   * @example ['openid']
   */
  scope?: string[];
}
