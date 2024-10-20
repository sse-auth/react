import React from "react";
import { IconButton, TextButton } from "../components";
import { parsePath, PopupWindow } from "../utils";
import { TwitchIcon } from "../assets/Icons";
import {
  SSEProps,
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  UserProps,
} from "./types";

export interface TwitchProps extends SSEProps {
  /**
   * Twitch Client ID
   */
  clientId?: string;

  /**
   * Twitch OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * Twitch OAuth Scope
   * @default []
   * @see https://dev.twitch.tv/docs/authentication/scopes
   * @example ['user:read:email']
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['user:read:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Twitch OAuth Authorization URL
   * @default 'https://id.twitch.tv/oauth2/authorize'
   */
  authorizationURL?: string;

  /**
   * Twitch OAuth Token URL
   * @default 'https://id.twitch.tv/oauth2/token'
   */
  tokenURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
   * @example { force_verify: 'true' }
   */
  authorizationParams?: Record<string, string>;
}

export async function useTwitch(props: TwitchProps): Promise<ResponseProps> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired = false,
    authorizationURL = "https://id.twitch.tv/oauth2/authorize",
    tokenURL = "https://id.twitch.tv/oauth2/token",
    authorizationParams = {},
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope =
    emailRequired && !scope.includes("user:read:email")
      ? [...scope, "user:read:email"]
      : scope;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Twitch Login",
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: parsePath(redirectUri).pathname,
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
        tokenData.error_description ||
          "Twitch login failed: Error retrieving access token"
      );
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch("https://api.twitch.tv/helix/users", {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await userResponse.json();
    const userData = data.data?.[0]

    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const TwitchLogin: React.FC<LoginButtonProps<TwitchProps>> = ({
    onFailure,
    onSuccess,
    ...props
  }) => {
    const [loading, setLoading] = React.useState(false);
  
    const handleLogin = async () => {
      setLoading(true);
      try {
        const { error, accessToken, userData } = await useTwitch(props);
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
        {loading ? "Loading..." : "Login with Twitch"}
      </TextButton>
    );
  };
  
  export const TwitchIconButton: React.FC<IconButtonProps<TwitchProps>> = ({
    onFailure,
    onSuccess,
    icon = TwitchIcon,
    variant,
    className,
    ...props
  }) => {
    const [loading, setLoading] = React.useState(false);
  
    const handleLogin = async () => {
      setLoading(true);
      try {
        const { error, accessToken, userData } = await useTwitch(props);
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
        aria-label="Login with Twitch"
      >
        {loading ? "Logging..." : "Login with Twitch"}
      </IconButton>
    );
  };
  