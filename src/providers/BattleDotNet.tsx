import React from "react";
import { ResponseProps, UserProps } from "./types";
import { PopupWindow } from "../utils";
import { randomUUID } from "crypto";
import { TextButton, IconButton } from "../components";
import { BattleDotNetIcon } from "../assets/Icons";

export type BattledotnetProps = {
  /**
   * Battle.net OAuth Client ID
   */
  clientId?: string;
  /**
   * Battle.net OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Battle.net OAuth Scope
   * @default []
   * @see https://develop.battle.net/documentation/guides/using-oauth
   * @example ['openid', 'wow.profile', 'sc2.profile', 'd3.profile']
   */
  scope?: string[];
  /**
   * Battle.net OAuth Region
   * @default EU
   * @see https://develop.battle.net/documentation/guides/using-oauth
   * @example EU (possible values: US, EU, APAC)
   */
  region?: string;
  /**
   * Battle.net OAuth Authorization URL
   * @default 'https://oauth.battle.net/authorize'
   */
  // authorizationURL?: string;
  /**
   * Battle.net OAuth Token URL
   * @default 'https://oauth.battle.net/token'
   */
  // tokenURL?: string;
  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://develop.battle.net/documentation/guides/using-oauth/authorization-code-flow
   */
  authorizationParams?: Record<string, string>;
  /** */
  redirectUri?: string;
};

export interface BattleDotNetLoginButtonProps extends BattledotnetProps {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
}

export type BattleDotNetIconButtonProps = BattledotnetProps & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
  //   icon: IconProps["icon"];
  icon?: React.ReactNode | string;
  variant?: string;
  className?: string;
};

/**
 * Initiates the GitHub login process using OAuth.
 *
 * @param {BattledotnetProps} props - Configuration options for the GitHub OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */

export async function useBattleDotNet(
  props: BattledotnetProps
): Promise<ResponseProps> {
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
    state: randomUUID(), // Todo: handle PKCE flow
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

    const tokenData = await response.json();

    if (tokenData.error) {
      throw new Error(
        tokenData.error_description || "Error retrieving access token"
      );
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userUrl, {
      headers: {
        "User-Agent": `Battledotnet-OAuth-${clientId}`,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const BattleDotNetLogin: React.FC<BattleDotNetLoginButtonProps> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useBattleDotNet(props);
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
      {loading ? "Loading..." : "Login with BattleDotNet"}
    </TextButton>
  );
};

export const BattleDotNetIconButton: React.FC<BattleDotNetIconButtonProps> = ({
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
      const { error, accessToken, userData } = await useBattleDotNet(props);
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
      aria-label="Login with BattleDotNet"
    >
      {loading ? "Logging..." : "Login with BattleDotNet"}
    </IconButton>
  );
};
