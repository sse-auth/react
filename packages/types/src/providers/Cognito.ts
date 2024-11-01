import { SSEProps } from "./index";

export type CognitoProps = SSEProps & {
  /**
   * AWS Cognito App Client ID
   */
  clientId?: string;
  /**
   * AWS Cognito App Client Secret
   */
  clientSecret?: string;
  /**
   * AWS Cognito User Pool ID
   */
  userPoolId?: string;
  /**
   * AWS Cognito Region
   */
  region?: string;
  /**
   * AWS Cognito Scope
   * @default []
   */
  scope?: string[];
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html
   */
  authorizationParams?: Record<string, string>;
};

export interface CognitoProfile extends Record<string, any> {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
}
