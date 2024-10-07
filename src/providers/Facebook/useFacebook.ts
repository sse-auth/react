import { FacebookProps } from "./types";
import { UserProps } from "../types";
import { PopupWindow } from "../../utils";

/**
 * Initiates the Facebook login process using OAuth.
 *
 * @param {FacebookProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useFacebook(props: FacebookProps): Promise<{
  error: Error | null | unknown;
  accessToken: string | null;
  userData: UserProps | null;
}> {
  const {
    clientId,
    clientSecret,
    scope = [],
    fields,
    authorizationURL = "https://www.facebook.com/v19.0/dialog/oauth",
    tokenURL = "https://graph.facebook.com/v19.0/oauth/access_token",
    userUrl = "https://graph.facebook.com/v19.0/me",
    authorizationParams = {},
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope = !scope.includes("email") ? [...scope, "email"] : scope;

  const authParams = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Facebook Login",
    redirectUri: redirectUri,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
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

    const accessToken = tokenData.access_token;

    const finalFields = fields || ["id", "name"];
    const fieldsString = finalFields.join(",");

    const userResponse = await fetch(userUrl, {
      body: JSON.stringify({
        fields: fieldsString,
        access_token: accessToken,
      }),
    });

    const userData = await userResponse.json();

    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}
