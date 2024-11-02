import React from "react";
import {
  Auth0Props,
  Auth0Profile,
  ResponseProps,
  LoginButtonProps,
  IconButtonProps,
} from "@sse-auth/types";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import { Auth0Icon } from "../assets/Icons";

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {Auth0Props} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: Auth0UserData | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useAuth0(
  props: Auth0Props
): Promise<ResponseProps<Auth0Profile>> {
  const {
    clientId,
    clientSecret,
    domain,
    audience,
    scope = ["openid", "offline_access", "profile"],
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
  const userInfo = `https://${domain}/api/v2/users`

  const finalScope =
    emailRequired && !scope.includes("email") ? [...scope, "email"] : scope;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: params.code,
        redirect_uri: window.location.origin,
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
    // console.log(jwt.decode(tokenData.id_token))

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

export const Auth0Login: React.FC<LoginButtonProps<Auth0Props>> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useAuth0(props);
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
      {loading ? "Loading..." : "Login with Auth0"}
    </TextButton>
  );
};

export const Auth0IconButton: React.FC<IconButtonProps<Auth0Props>> = ({
  onFailure,
  onSuccess,
  icon = Auth0Icon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useAuth0(props);
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
      aria-label="Login with Auth0"
    >
      {loading ? "Logging..." : "Login with Auth0"}
    </IconButton>
  );
};
