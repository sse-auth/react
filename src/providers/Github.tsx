// import { IconProps } from "../../components";
import React from "react";
import { PopupWindow, toQuery } from "../utils";
import {
  GithubProps,
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
} from "../types";
import { TextButton, IconButton } from "../components";
import axios from "axios";
import { GithubIcon } from "../assets/Icons";

export interface GitHubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  suspended_at?: string | null;
  collaborators?: number;
  two_factor_authentication: boolean;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
  };
  [claim: string]: unknown;
}

/**
 * Initiates the GitHub login process using OAuth.
 *
 * @param {GithubProps} props - Configuration options for the GitHub OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | object | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function useGithub(
  props: GithubProps
): Promise<ResponseProps<GitHubProfile>> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired = false,
    authorizationURL = "https://github.com/login/oauth/authorize",
    tokenURL = "https://github.com/login/oauth/access_token",
    userUrl = "https://api.github.com/user",
    authorizationParams = {},
  } = props;

  if (!clientId || !clientSecret) {
    throw new Error("Client Id and Client Secret is Required");
  }

  const finalScope =
    emailRequired && !scope.includes("user:email")
      ? [...scope, "user:email"]
      : scope;

  const authParams = new URLSearchParams({
    client_id: clientId || "",
    scope: finalScope.join(" "),
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authorizationURL}?${authParams.toString()}`,
    windowName: "Github Login",
    redirectUri: window.location.origin,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: params.code,
    });

    const proxyUrl = `https://cors-anywhere.herokuapp.com/${tokenURL}`;
    const response = await axios.post(`${proxyUrl}?${body}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "sseauth"
      },
    });

    const tokenData = await response.data;

    if (tokenData.error) {
      throw new Error(
        tokenData.error_description || "Error retrieving access token"
      );
    }

    const tokenIn = toQuery(tokenData);
    const accessToken = tokenIn.access_token;
    // const accessToken = tokenData.access_token

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

export const GithubLoginButton: React.FC<LoginButtonProps<GithubProps>> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useGithub(props);
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
      {loading ? "Loading..." : "Login with GitHub"}
    </TextButton>
  );
};

export const GithubIconButton: React.FC<IconButtonProps<GithubProps>> = ({
  onFailure,
  onSuccess,
  icon = GithubIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useGithub(props);
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
      aria-label="Login with GitHub"
    >
      {loading ? "Logging..." : "Login with GitHub"}
    </IconButton>
  );
};
