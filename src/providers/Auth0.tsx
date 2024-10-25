import React from "react";
import {
  ResponseProps,
  LoginButtonProps,
  IconButtonProps,
  Auth0Props,
} from "../types";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import { Auth0Icon } from "../assets/Icons";

export interface Auth0Profile extends Record<string, any> {
  /** The user's unique identifier. */
  sub?: string;
  /** Custom fields that store info about a user that influences the user's access, such as support plan, security roles (if not using the Authorization Core feature set), or access control groups. To learn more, read Metadata Overview. */
  app_metadata?: object;
  /** Indicates whether the user has been blocked. Importing enables subscribers to ensure that users remain blocked when migrating to Auth0. */
  blocked?: boolean;
  /** Timestamp indicating when the user profile was first created. */
  created_at?: Date;
  /** (unique) The user's email address. */
  email?: string;
  /** Indicates whether the user has verified their email address. */
  email_verified?: boolean;
  /** The user's family name. */
  family_name?: string;
  /** The user's given name. */
  given_name?: string;
  /** Custom fields that store info about a user that does not impact what they can or cannot access, such as work address, home address, or user preferences. To learn more, read Metadata Overview. */
  user_metadata?: object;
  /** (unique) The user's username. */
  username?: string;
  /** Contains info retrieved from the identity provider with which the user originally authenticates. Users may also link their profile to multiple identity providers; those identities will then also appear in this array. The contents of an individual identity provider object varies by provider. In some cases, it will also include an API Access Token to be used with the provider. */
  identities?: Array<{
    /** Name of the Auth0 connection used to authenticate the user. */
    connection?: string;
    /** Indicates whether the connection is a social one. */
    isSocial?: boolean;
    /** Name of the entity that is authenticating the user, such as Facebook, Google, SAML, or your own provider. */
    provider?: string;
    /** User's unique identifier for this connection/provider. */
    user_id?: string;
    /** User info associated with the connection. When profiles are linked, it is populated with the associated user info for secondary accounts. */
    profileData?: object;
    [key: string]: any;
  }>;
  /** IP address associated with the user's last login. */
  last_ip?: string;
  /** Timestamp indicating when the user last logged in. If a user is blocked and logs in, the blocked session updates last_login. If you are using this property from inside a Rule using the user< object, its value will be associated with the login that triggered the rule; this is because rules execute after login. */
  last_login?: Date;
  /** Timestamp indicating the last time the user's password was reset/changed. At user creation, this field does not exist. This property is only available for Database connections. */
  last_password_reset?: Date;
  /** Number of times the user has logged in. If a user is blocked and logs in, the blocked session is counted in logins_count. */
  logins_count?: number;
  /** List of multi-factor providers with which the user is enrolled. */
  multifactor?: string;
  /** The user's full name. */
  name?: string;
  /** The user's nickname. */
  nickname?: string;
  /** The user's phone number. Only valid for users with SMS connections. */
  phone_number?: string;
  /** Indicates whether the user has been verified their phone number. Only valid for users with SMS connections. */
  phone_verified?: boolean;
  /** URL pointing to the user's profile picture. */
  picture?: string;
  /** Timestamp indicating when the user's profile was last updated/modified. Changes to last_login are considered updates, so most of the time, updated_at will match last_login. */
  updated_at?: Date;
  /** (unique) The user's identifier. Importing allows user records to be synchronized across multiple systems without using mapping tables. */
  user_id?: string;
}

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
