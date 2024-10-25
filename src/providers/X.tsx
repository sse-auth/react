import React from "react";
import { IconButton, TextButton } from "../components";
import {
  encodeBase64,
  generateRandomUUID,
  parsePath,
  PopupWindow,
} from "../utils";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
  XProps,
} from "../types";
import { XIcon } from "../assets/Icons";

export interface XProfile {
  data: {
    /**
     * Unique identifier of this user. This is returned as a string in order to avoid complications with languages and tools
     * that cannot handle large integers.
     */
    id: string;
    /** The friendly name of this user, as shown on their profile. */
    name: string;
    /** @note Email is currently unsupported by X.  */
    email?: string;
    /** The X handle (screen name) of this user. */
    username: string;
    /**
     * The location specified in the user's profile, if the user provided one.
     * As this is a freeform value, it may not indicate a valid location, but it may be fuzzily evaluated when performing searches with location queries.
     *
     * To return this field, add `user.fields=location` in the authorization request's query parameter.
     */
    location?: string;
    /**
     * This object and its children fields contain details about text that has a special meaning in the user's description.
     *
     *To return this field, add `user.fields=entities` in the authorization request's query parameter.
     */
    entities?: {
      /** Contains details about the user's profile website. */
      url: {
        /** Contains details about the user's profile website. */
        urls: Array<{
          /** The start position (zero-based) of the recognized user's profile website. All start indices are inclusive. */
          start: number;
          /** The end position (zero-based) of the recognized user's profile website. This end index is exclusive. */
          end: number;
          /** The URL in the format entered by the user. */
          url: string;
          /** The fully resolved URL. */
          expanded_url: string;
          /** The URL as displayed in the user's profile. */
          display_url: string;
        }>;
      };
      /** Contains details about URLs, Hashtags, Cashtags, or mentions located within a user's description. */
      description: {
        hashtags: Array<{
          start: number;
          end: number;
          tag: string;
        }>;
      };
    };
    /**
     * Indicate if this user is a verified X user.
     *
     * To return this field, add `user.fields=verified` in the authorization request's query parameter.
     */
    verified?: boolean;
    /**
     * The text of this user's profile description (also known as bio), if the user provided one.
     *
     * To return this field, add `user.fields=description` in the authorization request's query parameter.
     */
    description?: string;
    /**
     * The URL specified in the user's profile, if present.
     *
     * To return this field, add `user.fields=url` in the authorization request's query parameter.
     */
    url?: string;
    /** The URL to the profile image for this user, as shown on the user's profile. */
    profile_image_url?: string;
    protected?: boolean;
    /**
     * Unique identifier of this user's pinned Tweet.
     *
     *  You can obtain the expanded object in `includes.tweets` by adding `expansions=pinned_tweet_id` in the authorization request's query parameter.
     */
    pinned_tweet_id?: string;
    created_at?: string;
  };
  includes?: {
    tweets?: Array<{
      id: string;
      text: string;
    }>;
  };
  [claims: string]: unknown;
}

export async function useX(props: XProps): Promise<ResponseProps<XProfile>> {
  const {
    clientId,
    clientSecret,
    scope,
    emailRequired = false,
    authorizationURL = "https://x.com/i/oauth2/authorize",
    tokenURL = "https://api.x.com/2/oauth2/token",
    userURL = "https://api.x.com/2/users/me",
    authorizationParams = {
      state: generateRandomUUID(),
      code_challenge: generateRandomUUID(),
    },
    redirectUri = window.location.origin,
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope = scope || ["tweet.read", "users.read", "offline.access"];

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "X Login",
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const authCode = encodeBase64(`${clientId}:${clientSecret}`);
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code_verifier: authorizationParams.code_challenge,
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

    const userFields =
      "description,id,name,profile_image_url,username,verified,verified_type";
    const userResponse = await fetch(`${userURL}?user.fields=${userFields}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const user = await userResponse.json();
    if (emailRequired) {
      const emailResponse = await fetch(
        "https://api.x.com/1.1/account/verify_credentials.json?include_email=true&skip_status=true",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!emailResponse.ok) {
        return { error: "Unable to fetch Email", accessToken, userData: user };
      }

      const emailData = await emailResponse.json();

      if (emailData && emailData.email) {
        user.email = emailData.email;
      } else {
        return {
          error: "X login failed: no user email found",
          accessToken,
          userData: user,
        };
      }
    }

    return { error: null, accessToken, userData: user };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const XLogin: React.FC<LoginButtonProps<XProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useX(props);
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
      {loading ? "Loading..." : "Login with X"}
    </TextButton>
  );
};

export const XIconButton: React.FC<IconButtonProps<XProps>> = ({
  onFailure,
  onSuccess,
  icon = XIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useX(props);
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
      aria-label="Login with X"
    >
      {loading ? "Logging..." : "Login with X"}
    </IconButton>
  );
};
