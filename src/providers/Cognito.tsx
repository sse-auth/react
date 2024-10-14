import React from "react";
import { ResponseProps, UserProps } from "./types";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import { CognitoIcon } from "../assets/Icons";

export type CognitoProps = {
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
  /** */
  redirectUri?: string;
};

// export type CognitoLoginButtonProps = CognitoProps & {
//   onSuccess: (accessToken: string, userData: any) => void;
//   onFailure: (error: Error) => void;
// };

// export type CognitoIconButtonProps = CognitoProps & {
//   onSuccess: (accessToken: string, userData: any) => void;
//   onFailure: (error: Error) => void;
//   //   icon: IconProps["icon"];
//   icon?: React.ReactNode | string;
//   variant?: string;
//   className?: string;
// };

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {Auth0Props} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useCognito(props: CognitoProps): Promise<ResponseProps<UserProps>> {
  const {
    clientId,
    clientSecret,
    userPoolId,
    region,
    scope = ["openid", "profile"],
    authorizationParams,
    redirectUri,
  } = props;

  if (!clientId || !clientSecret || !userPoolId || !region) {
    throw new Error(
      "Client Id, Client Secret, User Pool Id, region is Required"
    );
  }

  const authorizationUrl = `https://${userPoolId}.auth.${region}.amazoncognito.com/oauth2/authorize`;
  const tokenURL = `https://${userPoolId}.auth.${region}.amazoncognito.com/oauth2/token`;
  const userUrl = `https://${userPoolId}.auth.${region}.amazoncognito.com/oauth2/userInfo`;

  const authParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri || window.location.origin,
    response_type: "code",
    scope: scope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationUrl}?${authParams.toString()}`,
    windowName: "Cognito Login",
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${params.code}`,
    });

    const tokenData = await response.json();

    if (tokenData.error) {
      throw new Error(
        tokenData.error_description ||
          "Cognito login failed: Error retrieving access token"
      );
    }

    const tokenType = tokenData.token_type;
    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userUrl, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        Accept: "application/json",
      },
    });

    const userData = await userResponse.json();

    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}