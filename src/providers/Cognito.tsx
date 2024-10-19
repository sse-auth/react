import React from "react";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
  UserProps,
} from "./types";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import { CognitoIcon } from "../assets/Icons";

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

/**
 * Initiates the Cognito login process using OAuth.
 *
 * @param {CognitoProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useCognito(
  props: CognitoProps
): Promise<ResponseProps<UserProps>> {
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

export const CognitoLogin: React.FC<LoginButtonProps<CognitoProps>> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useCognito(props);
      if (error) {
        onFailure(error as Error);
      } else if (accessToken && userData) {
        onSuccess(accessToken, userData);
      }
    } catch (error) {
      onFailure(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TextButton onClick={handleLogin} disabled={loading}>
      {loading ? "Loading..." : "Login with Cognito"}
    </TextButton>
  );
};

export const CognitoIconButton: React.FC<IconButtonProps<CognitoProps>> = ({
  onFailure,
  onSuccess,
  icon = CognitoIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useCognito(props);
      if (error) {
        onFailure(error as Error);
      } else if (accessToken && userData) {
        onSuccess(accessToken, userData);
      }
    } catch (error) {
      onFailure(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton
      icon={icon}
      enabled={!loading}
      variant={variant}
      onClick={handleLogin}
      className={className}
      aria-label="Login with Cognito"
    >
      {loading ? "Logging..." : "Login with Cognito"}
    </IconButton>
  );
};
