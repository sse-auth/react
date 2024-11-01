import React from "react";
import { SpotifyIcon } from "../assets/Icons";
import {
  generateRandomString,
  parsePath,
  PopupWindow,
  encodeBase64,
} from "../utils";
import { TextButton, IconButton } from "../components";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SpotifyProps,
} from "../types";

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {SpotifyProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useSpotify(
  props: SpotifyProps
): Promise<ResponseProps<SpotifyProfile>> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired,
    authorizationURL = "https://accounts.spotify.com/authorize",
    tokenURL = "https://accounts.spotify.com/api/token",
    authorizationParams = {},
    redirectUri = window.location.origin,
    show_dialog = false,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope =
    emailRequired && !scope.includes("user-read-email")
      ? [...scope, "user-read-email"]
      : scope;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    state: generateRandomString(16),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}&show_dialog=${show_dialog}`,
    windowName: "Spotify Login",
    redirectUri: redirectUri,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const authCode = encodeBase64(`${clientId}:${clientSecret}`);
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: parsePath(redirectUri).pathname,
      code: params.code,
    });

    const response = await fetch(`${tokenURL}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authCode}`,
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

    const userResponse = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();
    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const SpotifyLogin: React.FC<LoginButtonProps<SpotifyProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useSpotify(props);
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
      {loading ? "Loading..." : "Login with Spotify"}
    </TextButton>
  );
};

export const SpotifyIconButton: React.FC<IconButtonProps<SpotifyProps>> = ({
  onFailure,
  onSuccess,
  icon = SpotifyIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useSpotify(props);
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
      aria-label="Login with Spotify"
    >
      {loading ? "Logging..." : "Login with Spotify"}
    </IconButton>
  );
};
