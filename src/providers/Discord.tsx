import React from "react";
import { DiscordIcon } from "../assets/Icons";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import {
  ResponseProps,
  LoginButtonProps,
  IconButtonProps,
  DiscordProps,
} from "../types";

export interface DiscordProfile extends Record<string, any> {
  /** the user's id (i.e. the numerical snowflake) */
  id?: string;
  /** the user's username, not unique across the platform */
  username?: string;
  /** the user's Discord-tag */
  discriminator?: string;
  /** the user's display name, if it is set  */
  global_name?: string | null;
  /**
   * the user's avatar hash:
   * https://discord.com/developers/docs/reference#image-formatting
   */
  avatar?: string | null;
  /** whether the user belongs to an OAuth2 application */
  bot?: boolean;
  /**
   * whether the user is an Official Discord System user (part of the urgent
   * message system)
   */
  system?: boolean;
  /** whether the user has two factor enabled on their account */
  mfa_enabled?: boolean;
  /**
   * the user's banner hash:
   * https://discord.com/developers/docs/reference#image-formatting
   */
  banner?: string | null;

  /** the user's banner color encoded as an integer representation of hexadecimal color code */
  accent_color?: number | null;

  /**
   * the user's chosen language option:
   * https://discord.com/developers/docs/reference#locales
   */
  locale?: string;
  /** whether the email on this account has been verified */
  verified?: boolean;
  /** the user's email */
  email?: string | null;
  /**
   * the flags on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  flags?: number;
  /**
   * the type of Nitro subscription on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-premium-types
   */
  premium_type?: number;
  /**
   * the public flags on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  public_flags?: number;
  /** undocumented field; corresponds to the user's custom nickname */
  display_name?: string | null;
  /**
   * undocumented field; corresponds to the Discord feature where you can e.g.
   * put your avatar inside of an ice cube
   */
  avatar_decoration?: string | null;
  /**
   * undocumented field; corresponds to the premium feature where you can
   * select a custom banner color
   */
  banner_color?: string | null;
  /** undocumented field; the CDN URL of their profile picture */
  image_url?: string;
}

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {DiscordProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */

export async function useDiscord(
  props: DiscordProps
): Promise<ResponseProps<DiscordProfile>> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired,
    profileRequired = true,
    authorizationParams = {},
    authorizationURL = "https://discord.com/oauth2/authorize",
    tokenURL = "https://discord.com/api/oauth2/token",
    redirectUri = window.location.origin,
    userUrl = "https://discord.com/api/users/@me",
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const initScope =
    emailRequired && !scope.includes("email") ? [...scope, "email"] : scope;
  const finalScope =
    profileRequired && !initScope.includes("identify")
      ? [...initScope, "identify"]
      : initScope;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId || "",
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Discord Login",
    redirectUri: window.location.origin,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
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

    const tokenType = tokenData.token_type;
    const accessToken = tokenData.access_token;

    const userResponse = await fetch(userUrl, {
      headers: {
        "user-agent": "SSE Auth",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const DiscordLogin: React.FC<LoginButtonProps<DiscordProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useDiscord(props);
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
      {loading ? "Loading..." : "Login with Discord"}
    </TextButton>
  );
};

export const DiscordIconButton: React.FC<IconButtonProps<DiscordProps>> = ({
  onFailure,
  onSuccess,
  icon = DiscordIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useDiscord(props);
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
      {loading ? "Logging..." : "Login with Discord"}
    </IconButton>
  );
};
