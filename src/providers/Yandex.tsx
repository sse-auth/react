import React from "react";
import { IconButton, TextButton } from "../components";
import { parsePath, PopupWindow, stringifyParsedURL } from "../utils";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  YandexProps,
} from "@sse-auth/types";
import { YandexIcon } from "../assets/Icons";

export interface YandexProfile {
  /** User's Yandex login. */
  login?: string;
  /** Yandex user's unique ID. */
  id?: string;
  /**
   * The ID of the app the OAuth token in the request was issued for.
   * Available in the [app properties](https://oauth.yandex.com/). To open properties, click the app name.
   */
  client_id?: string;
  /** Authorized Yandex user ID. It is formed on the Yandex side based on the `client_id` and `user_id` pair. */
  psuid?: string;
  /** An array of the user's email addresses. Currently only includes the default email address. */
  emails?: string[];
  /** The default email address for contacting the user. */
  default_email?: string;
  /**
   * Indicates that the stub (profile picture that is automatically assigned when registering in Yandex)
   * ID is specified in the `default_avatar_id` field.
   */
  is_avatar_empty?: boolean;
  /**
   * ID of the Yandex user's profile picture.
   * Format for downloading user avatars: `https://avatars.yandex.net/get-yapic/<default_avatar_id>/<size>`
   * @example "https://avatars.yandex.net/get-yapic/31804/BYkogAC6AoB17bN1HKRFAyKiM4-1/islands-200"
   * Available sizes:
   * `islands-small`: 28×28 pixels.
   * `islands-34`: 34×34 pixels.
   * `islands-middle`: 42×42 pixels.
   * `islands-50`: 50×50 pixels.
   * `islands-retina-small`: 56×56 pixels.
   * `islands-68`: 68×68 pixels.
   * `islands-75`: 75×75 pixels.
   * `islands-retina-middle`: 84×84 pixels.
   * `islands-retina-50`: 100×100 pixels.
   * `islands-200`: 200×200 pixels.
   */
  default_avatar_id?: string;
  /**
   * The user's date of birth in YYYY-MM-DD format.
   * Unknown elements of the date are filled in with zeros, such as: `0000-12-23`.
   * If the user's date of birth is unknow, birthday will be `null`
   */
  birthday?: string | null;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  /**
   * The first and last name that the user specified in Yandex ID.
   * Non-Latin characters of the first and last names are presented in Unicode format.
   */
  real_name?: string;
  /** User's gender. `null` Stands for unknown or unspecified gender. Will be `undefined` if not provided by Yandex. */
  sex?: "male" | "female" | null;
  /**
   * The default phone number for contacting the user.
   * The API can exclude the user's phone number from the response at its discretion.
   * The field contains the following parameters:
   * id: Phone number ID.
   * number: The user's phone number.
   */
  default_phone?: { id: number; number: string };
}

export async function useYandex(props: YandexProps): Promise<ResponseProps> {
  const {
    clientId,
    clientSecret,
    scope = ["login:info", "login:avatar"],
    emailRequired = false,
    authorizationURL = "https://oauth.yandex.ru/authorize",
    tokenURL = "https://oauth.yandex.ru/token",
    userURL = "https://login.yandex.ru/info?format=json",
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

    const userData: YandexProfile = await userResponse.json();

    const getPhoto =
      !userData.is_avatar_empty && userData.default_avatar_id
        ? `https://avatars.yandex.net/get-yapic/${userData.default_avatar_id}/islands-200`
        : null;

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
