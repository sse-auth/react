import { Auth0Props } from "./types";
import { UserProps } from "../types";
import { PopupWindow } from "../../utils";

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {Auth0Props} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useAuth0(props: Auth0Props): Promise<{
  error: Error | null | unknown;
  accessToken: string | null;
  userData: UserProps | null;
}> {
  const {
    clientId,
    clientSecret,
    domain,
    audience,
    scope = ["openid", "offline_access"],
    emailRequired,
    maxAge,
    connection,
    authorizationParams = {},
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const authorizationURL = `https://${domain}/authorize`;
  const tokenURL = `https://${domain}/oauth/token`;
  const userUrl = `https://${domain}/userinfo`;

  const finalScope =
    emailRequired && !scope.includes("email") ? [...scope, "email"] : scope;

  const p = {
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope.join(" "),
    audience: audience || "",
    max_age: maxAge || 0,
    connection: connection || "",
    ...authorizationParams,
  };

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope.join(" "),
    audience: audience || "",
    max_age: (maxAge || 0).toString(),
    connection: connection || "",
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Auth0 Login",
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const response = await fetch(tokenURL, {
      method: "POST",
      mode: "no-cors", // Add this option
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
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
        Authorization: `${tokenType} ${accessToken}`,
        Accept: "application/json",
      },
    });

    const userData = await userResponse.json();

    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}
