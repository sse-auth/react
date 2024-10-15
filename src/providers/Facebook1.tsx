// import { IconProps } from "../../components";
import React from "react";
import { PopupWindow, toQuery } from "../utils";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  UserProps,
} from "./types";
import { TextButton, IconButton } from "../components";
import axios from "axios";
import { FaceBookIcon } from "../assets/Icons";

export type FacebookProps = {
  /**
   * Facebook OAuth Client ID
   */
  clientId?: string;
  /**
   * Facebook OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Facebook OAuth Scope
   * @default []
   * @see https://developers.facebook.com/docs/permissions
   * @example [ 'email' ],
   */
  scope?: string[];

  /**
   * Facebook OAuth User Fields
   * @default [ 'id', 'name'],
   * @see https://developers.facebook.com/docs/graph-api/guides/field-expansion
   * @example [ 'id', 'name', 'email' ],
   */
  fields?: string[];

  /**
   * Facebook OAuth Authorization URL
   * @default 'https://www.facebook.com/v19.0/dialog/oauth'
   */
  authorizationURL?: string;

  /**
   * GitHub OAuth Token URL
   * @default 'https://graph.facebook.com/v19.0/me'
   */
  userUrl?: string;

  /**
   * Facebook OAuth Token URL
   * @default 'https://graph.facebook.com/v19.0/oauth/access_token'
   */
  tokenURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow/
   */
  authorizationParams?: Record<string, string>;

  /** */
  redirectUri?: string;
};

/**
 * Initiates the Facebook login process using OAuth.
 *
 * @param {FacebookProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | object | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useFacebook(
  props: FacebookProps
): Promise<ResponseProps<UserProps>> {
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

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: params.code,
    });

    const proxyUrl = `https://cors-anywhere.herokuapp.com/${tokenURL}`;
    const response = await axios.post(`${proxyUrl}?${body}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      //   body: JSON.stringify({
      //     client_id: clientId,
      //     client_secret: clientSecret,
      //     redirect_uri: redirectUri,
      //     code: params.code,
      //   }),
    });

    const tokenData = await response.data;

    if (tokenData.error) {
      throw new Error(
        tokenData.error_description || "Error retrieving access token"
      );
    }

    const tokenIn = toQuery(tokenData);
    const accessToken = tokenIn.access_token;
    // const accessToken = tokenData.access_token;

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

export const FacebookLogin: React.FC<LoginButtonProps<FacebookProps>> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useFacebook(props);
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
      {loading ? "Loading..." : "Login with Facebook"}
    </TextButton>
  );
};

export const FacebookIconButton: React.FC<IconButtonProps<FacebookProps>> = ({
  onFailure,
  onSuccess,
  icon = FaceBookIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useFacebook(props);
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
      aria-label="Login with Facebook"
    >
      {loading ? "Logging..." : "Login with Facebook"}
    </IconButton>
  );
};
