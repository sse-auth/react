import React from "react";
import { IconButton, TextButton } from "../components";
import { PopupWindow } from "../utils";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
  UserProps,
} from "./types";
import { SteamIcon } from "../assets/Icons";

export interface SteamProps extends SSEProps {
  /**
   * Steam API Key
   * @see https://steamcommunity.com/dev
   */
  apiKey?: string;

  /**
   * Steam Open ID OAuth Authorization URL
   * @default 'https://steamcommunity.com/openid/login'
   */
  authorizationURL?: string;
}

export async function useSteam(
  props: SteamProps
): Promise<ResponseProps> {
  if (!props.apiKey) {
    throw new Error("Missing NUXT_OAUTH_STEAM_API_KEY env variable.");
  }

  const redirectUrl = props.redirectUri ?? window.location.origin;
  const steamOpenIdParams = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": redirectUrl,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  const authorizationURL =
    props.authorizationURL || "https://steamcommunity.com/openid/login";

  const popup = new PopupWindow({
    url: `${authorizationURL}?${steamOpenIdParams.toString()}`,
    windowName: "Steam Login",
    redirectUri: redirectUrl,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const validateAuth = await fetch(
      `${authorizationURL}?${new URLSearchParams({
        ...params,
        "openid.mode": "check_authentication",
      })}`
    );

    const validateResponse = await validateAuth.text();
    if (!validateResponse.includes("is_valid:true")) {
      throw new Error("Steam login failed: Unknown error");
    }

    const steamId = params["openid.claimed_id"].split("/").pop();
    const userResponse = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${props.apiKey}&steamids=${steamId}`
    );
    const userData = await userResponse.json();

    return {
      userData: userData.response.players[0],
      accessToken: null,
      error: null,
    };
  } catch (error) {
    return { error: error, userData: null, accessToken: null };
  }
}

export const SteamLogin: React.FC<LoginButtonProps<SteamProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useSteam(props);
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
      {loading ? "Loading..." : "Login with Steam"}
    </TextButton>
  );
};

export const SteamIconButton: React.FC<IconButtonProps<SteamProps>> = ({
  onFailure,
  onSuccess,
  icon = SteamIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useSteam(props);
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
      aria-label="Login with Steam"
    >
      {loading ? "Logging..." : "Login with Steam"}
    </IconButton>
  );
};
