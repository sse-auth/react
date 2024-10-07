import { UserProps } from "../types";
import { BattledotnetProps } from "./types";
import { PopupWindow } from "../../utils";
import { randomUUID } from "node:crypto";

/**
 * Initiates the GitHub login process using OAuth.
 *
 * @param {BattledotnetProps} props - Configuration options for the GitHub OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */

export async function useBattleDotNet(props: BattledotnetProps): Promise<{
  error: Error | null | unknown;
  accessToken: string | null;
  userData: UserProps | null;
}> {
  const {
    clientId,
    clientSecret,
    scope = [],
    // authorizationURL = "https://oauth.battle.net/authorize",
    // tokenURL = "https://oauth.battle.net/token",
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
