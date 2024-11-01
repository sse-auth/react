import React from "react";
import { DiscordIcon } from "../assets/Icons";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import {
  ResponseProps,
  LoginButtonProps,
  IconButtonProps,
  DiscordProps,
} from "../types";


/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {DiscordProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */

export async function useDiscord(
  props: DiscordProps
): Promise<ResponseProps<DiscordProfile>> {
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
