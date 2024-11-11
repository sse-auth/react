import React from "react";
import {
  BattledotnetProps,
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  TokenSet,
} from "@sse-auth/types";
import { BattleNetProfile } from "@sse-auth/types/providers/BattleDotNet";
import { PopupWindow } from "../utils";
// import { randomUUID } from "crypto";
import { TextButton, IconButton } from "../components";
import { BattleDotNetIcon } from "../assets/Icons";

/**
 * Initiates the GitHub login process using OAuth.
 *
 * @param {BattledotnetProps} props - Configuration options for the GitHub OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */

export async function useBattleDotNet(
  props: BattledotnetProps
): Promise<ResponseProps<BattleNetProfile>> {
  const {
    clientId,
    clientSecret,
    scope = [],
    authorizationParams = {},
    region = "EU",
    redirectUri = window.location.origin,
  } = props;

  const userUrl = "https://oauth.battle.net/userinfo";

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope = !scope.includes("openid") ? [...scope, "openid"] : scope;

  const authParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    // state: randomUUID(), // Todo: handle PKCE flow
    response_type: "code",
    ...authorizationParams,
  });

  const authUrl =
    region === "CN"
      ? "https://oauth.battlenet.com.cn/authorize"
      : "https://oauth.battlenet.com/authorize";

  const tokURL =
    region === "CN"
      ? "https://oauth.battlenet.com.cn/token"
      : "https://oauth.battlenet.com/token";

  const popup = new PopupWindow({
    url: `${authUrl}?${authParams.toString()}`,
    windowName: "Github Login",
    redirectUri: window.location.origin,
  });

  const authCode = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  //   const authCode = btoa(`${clientId}:${clientSecret}`);

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const response = await fetch(tokURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authCode}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        scope: finalScope.join(" "),
        code: params.code,
      }),
    });

    const tokenData: TokenSet = await response.json();

    if (tokenData.error) {
      throw new Error("Error retrieving `Battle.net` access token");
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userUrl, {
      headers: {
        "User-Agent": `Battledotnet-OAuth-${clientId}`,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData: BattleNetProfile = await userResponse.json();

    return {
      error: null,
      accessToken: tokenData,
      userData,
      profile: {
        id: userData.sub,
        name: userData.battle_tag,
        email: null,
        image: null,
      },
    };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const BattleDotNetLogin: React.FC<
  LoginButtonProps<BattledotnetProps>
> = ({ onSuccess, onFailure, ...props }) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData, profile } = await useBattleDotNet(
        props
      );
      if (error) {
        onFailure(error as Error);
      } else if (accessToken && userData) {
        onSuccess(accessToken, userData, profile);
      }
    } catch (error) {
      onFailure(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TextButton onClick={handleLogin} disabled={loading}>
      {loading ? "Loading..." : "Login with BattleDotNet"}
    </TextButton>
  );
};

export const BattleDotNetIconButton: React.FC<
  IconButtonProps<BattledotnetProps>
> = ({
  onFailure,
  onSuccess,
  icon = BattleDotNetIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData, profile } = await useBattleDotNet(
        props
      );
      if (error) {
        onFailure(error as Error);
      } else if (accessToken && userData) {
        onSuccess(accessToken, userData, profile);
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
      aria-label="Login with BattleDotNet"
    >
      {loading ? "Logging..." : "Login with BattleDotNet"}
    </IconButton>
  );
};
