import React from "react";
import { IconButton, TextButton } from "../components";
import {
  encodeBase64,
  generateRandomUUID,
  parsePath,
  PopupWindow,
} from "../utils";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
} from "./types";
import { XIcon } from "../assets/Icons";

export interface XProps extends SSEProps {
  /**
   * X OAuth Client ID
   * @default process.env.NUXT_OAUTH_X_CLIENT_ID
   */
  clientId?: string;
  /**
   * X OAuth Client Secret
   * @default process.env.NUXT_OAUTH_X_CLIENT_SECRET
   */
  clientSecret?: string;
  /**
   * X OAuth Scope
   * @default []
   * @see https://developer.x.com/en/docs/authentication/oauth-2-0/user-access-token
   * @example ['tweet.read', 'users.read', 'offline.access'],
   */
  scope?: string[];

  /**
   * Require email from user
   * @default false
   */
  emailRequired?: boolean;

  /**
   * X OAuth Authorization URL
   * @default 'https://twitter.com/i/oauth2/authorize'
   */
  authorizationURL?: string;

  /**
   * X OAuth Token URL
   * @default 'https://api.twitter.com/2/oauth2/token'
   */
  tokenURL?: string;

  /**
   * X OAuth User URL
   * @default 'https://api.twitter.com/2/users/me'
   */
  userURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developer.x.com/en/docs/authentication/oauth-2-0/user-access-token
   */
  authorizationParams: Record<string, string>;
}

export async function useX(props: XProps): Promise<ResponseProps> {
  const {
    clientId,
    clientSecret,
    scope,
    emailRequired = false,
    authorizationURL = "https://x.com/i/oauth2/authorize",
    tokenURL = "https://api.x.com/2/oauth2/token",
    userURL = "https://api.x.com/2/users/me",
    authorizationParams = {
      state: generateRandomUUID(),
      code_challenge: generateRandomUUID(),
    },
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope = scope || ["tweet.read", "users.read", "offline.access"];

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "X Login",
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const authCode = encodeBase64(`${clientId}:${clientSecret}`);
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code_verifier: authorizationParams.code_challenge,
      redirect_uri: parsePath(redirectUri).pathname,
      code: params.code,
    });

    const response = await fetch(`${tokenURL}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authCode}`,
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

    const userFields =
      "description,id,name,profile_image_url,username,verified,verified_type";
    const userResponse = await fetch(`${userURL}?user.fields=${userFields}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const user = await userResponse.json();
    if (emailRequired) {
      const emailResponse = await fetch(
        "https://api.x.com/1.1/account/verify_credentials.json?include_email=true&skip_status=true",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!emailResponse.ok) {
        return { error: "Unable to fetch Email", accessToken, userData: user };
      }

      const emailData = await emailResponse.json();

      if (emailData && emailData.email) {
        user.email = emailData.email;
      } else {
        return {
          error: "X login failed: no user email found",
          accessToken,
          userData: user,
        };
      }
    }

    return { error: null, accessToken, userData: user };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const XLogin: React.FC<LoginButtonProps<XProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useX(props);
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
      {loading ? "Loading..." : "Login with X"}
    </TextButton>
  );
};

export const XIconButton: React.FC<IconButtonProps<XProps>> = ({
  onFailure,
  onSuccess,
  icon = XIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useX(props);
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
      aria-label="Login with X"
    >
      {loading ? "Logging..." : "Login with X"}
    </IconButton>
  );
};
