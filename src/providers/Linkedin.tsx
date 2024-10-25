import React from "react";
import { LinkedInIcon } from "../assets/Icons";
import { parseURL, PopupWindow, stringifyParsedURL } from "../utils";
import { TextButton, IconButton } from "../components";
import {
  IconButtonProps,
  LinkedInProps,
  LoginButtonProps,
  ResponseProps,
} from "../types";

export interface LinkedInProfile extends Record<string, any> {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  email?: string;
  email_verified?: boolean;
  [key: string]: any;
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
): Promise<ResponseProps> {
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
