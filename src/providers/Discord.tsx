import React from "react";
import { DiscordIcon } from "../assets/Icons";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import {
  ResponseProps,
  UserProps,
  LoginButtonProps,
  IconButtonProps,
  SSEProps,
} from "./types";

export interface DiscordProps extends SSEProps {
  /**
   * Discord OAuth Client ID
   */
  clientId?: string;
  /**
   * Discord OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Discord OAuth Scope
   * @default []
   * @see https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
   * @example ['identify', 'email']
   * Without the identify scope the user will not be returned.
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['email'] scope if not present.
   * @default false
   */
  emailRequired?: boolean;
  /**
   * Require profile from user, adds the ['identify'] scope if not present.
   * @default true
   */
  profileRequired?: boolean;
  /**
   * Discord OAuth Authorization URL
   * @default 'https://discord.com/oauth2/authorize'
   */
  authorizationURL?: string;
  /**
   * Discord OAuth Token URL
   * @default 'https://discord.com/api/oauth2/token'
   */
  tokenURL?: string;
  /**
   * Discord OAuth User fetch URL
   * @default 'https://discord.com/api/users/@me'
   */
  userUrl?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see 'https://discord.com/developers/docs/topics/oauth2#authorization-code-grant'
   * @example { allow_signup: 'true' }
   */
  authorizationParams?: Record<string, string>;
}

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {DiscordProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */

export async function useDiscord(
  props: DiscordProps
): Promise<ResponseProps<UserProps>> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired,
    profileRequired = true,
    authorizationParams = {},
    authorizationURL = "https://discord.com/oauth2/authorize",
    tokenURL = "https://discord.com/api/oauth2/token",
    redirectUri = window.location.origin,
    userUrl = "https://discord.com/api/users/@me",
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const initScope =
    emailRequired && !scope.includes("email") ? [...scope, "email"] : scope;
  const finalScope =
    profileRequired && !initScope.includes("identify")
      ? [...initScope, "identify"]
      : initScope;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId || "",
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Discord Login",
    redirectUri: window.location.origin,
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
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: params.code,
      }),
    });

    const tokenData = await response.json();

    if (tokenData.error) {
      throw new Error(
        tokenData.error_description || "Error retrieving access token"
      );
    }

    const tokenType = tokenData.token_type;
    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userUrl, {
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

export const DiscordLogin: React.FC<LoginButtonProps<DiscordProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useDiscord(props);
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
      {loading ? "Loading..." : "Login with Discord"}
    </TextButton>
  );
};

export const DiscordIconButton: React.FC<IconButtonProps<DiscordProps>> = ({
  onFailure,
  onSuccess,
  icon = DiscordIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useDiscord(props);
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
      {loading ? "Logging..." : "Login with Discord"}
    </IconButton>
  );
};
