import React from "react";
import { KeycloakIcon } from "../assets/Icons";
import { PopupWindow, parsePath } from "../utils";
import { TextButton, IconButton } from "../components";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
  UserProps,
} from "./types";

export interface KeycloakProps extends SSEProps {
  /**
   * Keycloak OAuth Client ID
   */
  clientId?: string;
  /**
   * Keycloak OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * Keycloak OAuth Server URL
   * @example http://192.168.1.10:8080/auth
   */
  serverUrl?: string;
  /**
   * Keycloak OAuth Realm
   */
  realm?: string;
  /**
   * Keycloak OAuth Scope
   * @default []
   * @see https://www.keycloak.org/docs/latest/authorization_services/
   * @example ['openid']
   */
  scope?: string[];
  /**
   * Extra authorization parameters to provide to the authorization URL
   */
  authorizationParams?: Record<string, string>;
}

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {KeycloakProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useKeyclock(
  props: KeycloakProps
): Promise<ResponseProps<UserProps>> {
  const {
    clientId,
    clientSecret,
    serverUrl,
    realm,
    scope,
    authorizationParams = {},
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret || !serverUrl || !realm) {
    throw new Error("Client Id, Client Secret, Server Url, Realm is Required");
  }

  const realmURL = `${serverUrl}/realms/${realm}`;
  const authorizationURL = `${realmURL}/protocol/openid-connect/auth`;
  const tokenURL = `${realmURL}/protocol/openid-connect/token`;
  const userUrl = `${realmURL}/protocol/openid-connect/userinfo`;

  const finalScope = scope || ["openid"];

  const authParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    response_type: "code",
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Keycloak Login",
    redirectUri: window.location.origin,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const popScope = !finalScope.includes("openid")
      ? [...finalScope, "openid"]
      : finalScope;

    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: parsePath(redirectUri).pathname,
        code: params.code,
      }),
    });

    const tokenData = await response.json();

    if (tokenData.error) {
      throw new Error(
        tokenData.error?.data?.error_description ||
          "Error retrieving access token"
      );
    }

    const accessToken = tokenData.access_token;

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

export const KeycloakLogin: React.FC<LoginButtonProps<KeycloakProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useKeyclock(props);
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
      {loading ? "Loading..." : "Login with Keycloak"}
    </TextButton>
  );
};

export const KeycloakIconButton: React.FC<IconButtonProps<KeycloakProps>> = ({
  onFailure,
  onSuccess,
  icon = KeycloakIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useKeyclock(props);
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
      aria-label="Login with Keycloak"
    >
      {loading ? "Logging..." : "Login with Keycloak"}
    </IconButton>
  );
};
