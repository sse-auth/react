import { UserProps } from "../types";
import { GithubProps } from "./types";
import { PopupWindow, toQuery } from "../../utils";
import axios from "axios";

/**
 * Initiates the GitHub login process using OAuth.
 *
 * @param {GithubProps} props - Configuration options for the GitHub OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */

export async function useGithub(props: GithubProps): Promise<{
  error: Error | null | unknown;
  accessToken: string | null | object;
  userData: UserProps | null;
}> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired = false,
    authorizationURL = "https://github.com/login/oauth/authorize",
    tokenURL = "https://github.com/login/oauth/access_token",
    userUrl = "https://api.github.com/user",
    authorizationParams = {},
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope =
    emailRequired && !scope.includes("user:email")
      ? [...scope, "user:email"]
      : scope;

  const authParams = new URLSearchParams({
    client_id: clientId || "",
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Github Login",
    redirectUri: window.location.origin,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: params.code,
    });

    const proxyUrl = `https://cors-anywhere.herokuapp.com/${tokenURL}`;
    const response = await axios.post(`${tokenURL}?${body}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const tokenData = await response.data;

    if (tokenData.error) {
      throw new Error(
        tokenData.error_description || "Error retrieving access token"
      );
    }

    // const tokenIn = toQuery(tokenData);
    // const accessToken = tokenIn.access_token
    const accessToken = tokenData.access_token

    const userResponse = await fetch(userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const userData = await userResponse.json();

    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}
