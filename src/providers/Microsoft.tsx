import React from "react";
import { MicrosoftIcon } from "../assets/Icons";
import { PopupWindow, parsePath } from "../utils";
import { TextButton, IconButton } from "../components";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
  UserProps,
} from "./types";

export interface MicrosoftProps extends SSEProps {
  /**
   * Microsoft OAuth Client ID
   */
  clientId?: string;
  /**
   * Microsoft  OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Microsoft OAuth Tenant ID
   */
  tenant?: string;
  /**
   * Microsoft  OAuth Scope
   * @default ['User.Read']
   * @see https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc
   */
  scope?: string[];
  /**
   * Microsoft OAuth Authorization URL
   * @default 'https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize'
   * @see https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
   */
  authorizationURL?: string;
  /**
   * Microsoft OAuth Token URL
   * @default 'https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token'
   * @see https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
   */
  tokenURL?: string;
  /**
   * Microsoft OAuth User URL
   * @default 'https://graph.microsoft.com/v1.0/me'
   * @see https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http
   */
  userURL?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
   */
  authorizationParams?: Record<string, string>;
  /**
   * Redirect URL to prevent in prod prevent redirect_uri mismatch http to https
   * @see https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
   */
  redirectUrl?: string;
}

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {MicrosoftProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useMicrosoft(
  config: MicrosoftProps
): Promise<ResponseProps<UserProps>> {
  const {
    clientId,
    clientSecret,
    tenant,
    scope,
    authorizationURL = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
    tokenURL = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    userURL = "https://graph.microsoft.com/v1.0/me",
    authorizationParams,
    redirectUrl = window.location.origin,
  } = config;

  if (!clientId || !clientSecret || !tenant) {
    throw new Error("Client Id, Client Secret and Tenant is Required");
  }

  const finalScope = scope && scope.length > 0 ? scope : ["User.Read"];

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUrl,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Microsoft Login",
    redirectUri: redirectUrl ?? window.location.origin,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: parsePath(redirectUrl).pathname,
      client_id: clientId,
      client_secret: clientSecret,
      code: String(params.code),
    });

    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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

    const tokenType = tokenData.token_type;
    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userURL, {
      headers: {
        "user-agent": "SSE Auth",
        Authorization: `${tokenType} ${accessToken}`,
      },
    });

    const userData = await userResponse.json();
    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const MicrosoftLogin: React.FC<LoginButtonProps<MicrosoftProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useMicrosoft(props);
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
      {loading ? "Loading..." : "Login with Microsoft"}
    </TextButton>
  );
};

export const MicrosoftIconButton: React.FC<IconButtonProps<MicrosoftProps>> = ({
  onFailure,
  onSuccess,
  icon = MicrosoftIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useMicrosoft(props);
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
      aria-label="Login with Microsoft"
    >
      {loading ? "Logging..." : "Login with Microsoft"}
    </IconButton>
  );
};
