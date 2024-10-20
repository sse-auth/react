import React from "react";
import { IconButton, TextButton } from "../components";
import { parsePath, PopupWindow, stringifyParsedURL } from "../utils";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
} from "./types";
import { YandexIcon } from "../assets/Icons";

export interface YandexProps extends SSEProps {
  /**
   * Yandex OAuth Client ID
   */
  clientId?: string;

  /**
   * Yandex OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * Yandex OAuth Scope
   * @default []
   * @see https://yandex.ru/dev/id/doc/en/codes/code-url#optional
   * @example ["login:avatar", "login:birthday", "login:email", "login:info", "login:default_phone"]
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['login:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Yandex OAuth Authorization URL
   * @default 'https://oauth.yandex.ru/authorize'
   */
  authorizationURL?: string;

  /**
   * Yandex OAuth Token URL
   * @default 'https://oauth.yandex.ru/token'
   */
  tokenURL?: string;

  /**
   * Yandex OAuth User URL
   * @default 'https://login.yandex.ru/info'
   */
  userURL?: string;
}

export async function useYandex(props: YandexProps): Promise<ResponseProps> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired = false,
    authorizationURL = "https://oauth.yandex.ru/authorize",
    tokenURL = "https://oauth.yandex.ru/authorize",
    userURL = "https://login.yandex.ru/info",
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope =
    emailRequired && !scope.includes("login:email")
      ? [...scope, "login:email"]
      : scope;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Yandex Login",
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
      redirect_uri: stringifyParsedURL(parsePath(redirectUri)),
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

    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userURL, {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    const userData = await userResponse.json();
    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const YandexLogin: React.FC<LoginButtonProps<YandexProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useYandex(props);
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
      {loading ? "Loading..." : "Login with Yandex"}
    </TextButton>
  );
};

export const YandexIconButton: React.FC<IconButtonProps<YandexProps>> = ({
  onFailure,
  onSuccess,
  icon = YandexIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useYandex(props);
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
      aria-label="Login with Yandex"
    >
      {loading ? "Logging..." : "Login with Yandex"}
    </IconButton>
  );
};
