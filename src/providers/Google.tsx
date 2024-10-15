import React from "react";
import { GoogleIcon } from "../assets/Icons";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import {
  ResponseProps,
  UserProps,
  LoginButtonProps,
  IconButtonProps,
  SSEProps,
} from "./types";

export interface GoogleProps extends SSEProps {
  /**
   * Google OAuth Client ID
   */
  clientId?: string;

  /**
   * Google OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * Google OAuth Scope
   * @default []
   * @see https://developers.google.com/identity/protocols/oauth2/scopes#google-sign-in
   * @example ['email', 'openid', 'profile']
   */
  scope?: string[];

  /**
   * Google OAuth Authorization URL
   * @default 'https://accounts.google.com/o/oauth2/v2/auth'
   */
  authorizationURL?: string;

  /**
   * Google OAuth Token URL
   * @default 'https://oauth2.googleapis.com/token'
   */
  tokenURL?: string;

  /**
   * Google OAuth User URL
   * @default 'https://www.googleapis.com/oauth2/v3/userinfo'
   */
  userURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developers.google.com/identity/protocols/oauth2/web-server#httprest_3
   * @example { access_type: 'offline' }
   */
  authorizationParams?: Record<string, string>;
}

type ErrorCode =
  | "invalid_request"
  | "access_denied"
  | "unauthorized_client"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable";

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  hd?: string;
  prompt?: string;
  token_type: string;
  scope?: string;
  state?: string;
  error?: ErrorCode;
  error_description?: string;
  error_uri?: string;
}

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {GoogleProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useGoogle(
  props: GoogleProps
): Promise<ResponseProps<UserProps>> {
  const {
    clientId,
    clientSecret,
    scope,
    authorizationURL = "https://accounts.google.com/o/oauth2/v2/auth",
    tokenURL = "https://oauth2.googleapis.com/token",
    userURL = "https://www.googleapis.com/oauth2/v3/userinfo",
    authorizationParams,
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope = scope || ["email", "profile"];

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Google Login",
    redirectUri: window.location.origin,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const body = JSON.stringify({
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code: params.code,
    });

    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const tokenData = await response.json();

    if (tokenData.error) {
      throw new Error(
        tokenData.error?.data?.error_description ||
          "Error retrieving access token"
      );
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();
    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const GoogleLogin: React.FC<LoginButtonProps<GoogleProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useGoogle(props);
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
      {loading ? "Loading..." : "Login with Google"}
    </TextButton>
  );
};

export const GoogleIconButton: React.FC<IconButtonProps<GoogleProps>> = ({
  onFailure,
  onSuccess,
  icon = GoogleIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useGoogle(props);
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
      aria-label="Login with Auth0"
    >
      {loading ? "Logging..." : "Login with Google"}
    </IconButton>
  );
};
