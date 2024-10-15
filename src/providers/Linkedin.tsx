import React from "react";
import { LinkedInIcon } from "../assets/Icons";
import { parseURL, PopupWindow, stringifyParsedURL } from "../utils";
import { TextButton, IconButton } from "../components";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
  UserProps,
} from "./types";

export interface LinkedInProps extends SSEProps {
  /**
   * LinkedIn OAuth Client ID
   */
  clientId?: string;
  /**
   * LinkedIn OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * LinkedIn OAuth Scope
   * @default ['openid', 'profile', 'email']
   * @example ['openid', 'profile']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * LinkedIn OAuth Authorization URL
   * @default 'https://www.linkedin.com/oauth/v2/authorization'
   */
  authorizationURL?: string;
  /**
   * LinkedIn OAuth Token URL
   * @default 'https://www.linkedin.com/oauth/v2/accessToken'
   */
  tokenURL?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin/context
   */
  authorizationParams?: Record<string, string>;
}

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {LinkedInProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useLinkedIn(
  props: LinkedInProps
): Promise<ResponseProps<UserProps>> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired,
    authorizationURL = "https://www.linkedin.com/oauth/v2/authorization",
    tokenURL = "https://www.linkedin.com/oauth/v2/accessToken",
    authorizationParams = {},
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const initScope1 = scope || [];
  const initScope2 = !initScope1.length
    ? [...initScope1, "profile", "openid", "email"]
    : initScope1;
  const finalScope =
    emailRequired && !initScope2.includes("email")
      ? [...initScope2, "email"]
      : initScope2;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "LinkedIn Login",
    redirectUri: redirectUri ?? window.location.origin,
  });

  const parsedRedirectUrl = parseURL(redirectUri);
  parsedRedirectUrl.search = "";

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: stringifyParsedURL(parsedRedirectUrl),
      client_id: clientId,
      client_secret: clientSecret,
      code: params.code,
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

    const accessToken = tokenData.access_token;

    const userResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        "user-agent": "SSE Auth",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();
    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const LinkedInLogin: React.FC<LoginButtonProps<LinkedInProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useLinkedIn(props);
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
      {loading ? "Loading..." : "Login with LinkedIn"}
    </TextButton>
  );
};

export const LinkedInIconButton: React.FC<IconButtonProps<LinkedInProps>> = ({
  onFailure,
  onSuccess,
  icon = LinkedInIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useLinkedIn(props);
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
      {loading ? "Logging..." : "Login with LinkedIn"}
    </IconButton>
  );
};
