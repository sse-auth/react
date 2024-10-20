import React from "react";
import { IconButton, TextButton } from "../components";
import { parsePath, PopupWindow } from "../utils";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
} from "./types";
import { XsuaaIcon } from "../assets/Icons";

export interface XSUAAProps extends SSEProps {
  /**
   * XSUAA OAuth Client ID
   */
  clientId?: string;
  /**
   * XSUAA OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * XSUAA OAuth Issuer
   */
  domain?: string;
  /**
   * XSUAA OAuth Scope
   * @default []
   * @see https://sap.github.io/cloud-sdk/docs/java/guides/cloud-foundry-xsuaa-service
   * @example ['openid']
   */
  scope?: string[];
}

export async function useXsuaa(props: XSUAAProps): Promise<ResponseProps> {
  const {
    clientId,
    clientSecret,
    domain,
    scope = [],
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret || !domain) {
    throw new Error("Client Id, Client Secret and Domain is Required");
  }

  const authorizationURL = `https://${domain}/oauth/authorize`;
  const tokenURL = `https://${domain}/oauth/token`;
  const userURL = `https://${domain}/userinfo`;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope.join(" "),
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "XSUAA Login",
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: parsePath(redirectUri).pathname,
      code: `${params.code}`,
    });

    const response = await fetch(`${tokenURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    const tokenData = await response.json();

    if (tokenData.error) {
      throw new Error(
        tokenData.error?.data?.error_description ||
          "Error retrieving access token"
      );
    }

    const tokenType = tokenData.token_type;
    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userURL, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    });

    const userData = await userResponse.json();
    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const XsuaaLogin: React.FC<LoginButtonProps<XSUAAProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useXsuaa(props);
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
      {loading ? "Loading..." : "Login with Xsuaa"}
    </TextButton>
  );
};

export const XsuaaIconButton: React.FC<IconButtonProps<XSUAAProps>> = ({
  onFailure,
  onSuccess,
  icon = XsuaaIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useXsuaa(props);
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
      aria-label="Login with Xsuaa"
    >
      {loading ? "Logging..." : "Login with Xsuaa"}
    </IconButton>
  );
};
