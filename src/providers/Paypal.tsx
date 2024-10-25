import React from "react";
import { PaypalIcon } from "../assets/Icons";
import { PopupWindow } from "../utils";
import { TextButton, IconButton } from "../components";
import { btoa } from "buffer";
import {
  IconButtonProps,
  LoginButtonProps,
  ResponseProps,
  SSEProps,
  UserProps,
} from "./types";

export interface PaypalProps extends SSEProps {
  /**
   * PayPal Client ID
   */
  clientId?: string;

  /**
   * PayPal OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * PayPal OAuth Scope
   * @default []
   * @see https://developer.paypal.com/docs/log-in-with-paypal/integrate/reference/#scope-attributes
   * @example ['email', 'profile']
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Use PayPal sandbox environment
   * @default false // true in development, false in production
   */
  sandbox?: boolean;

  /**
   * PayPal OAuth Authorization URL
   * @default 'https://www.paypal.com/signin/authorize'
   */
  authorizationURL?: string;

  /**
   * PayPal OAuth Token URL
   * @default 'https://api-m.paypal.com/v1/oauth2/token'
   */
  tokenURL?: string;

  /**
   * Paypal OAuth User URL
   * @default 'https://api-m.paypal.com/v1/identity/openidconnect/userinfo'
   */
  userURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developer.paypal.com/docs/log-in-with-paypal/integrate/build-button/#link-constructauthorizationendpoint
   * @example { flowEntry: 'static' }
   */
  authorizationParams?: Record<string, string>;
}

/**
 * Initiates the Auth0 login process using OAuth.
 *
 * @param {PaypalProps} props - Configuration options for the Facebook OAuth process.
 * @returns {Promise<{ error: Error | null, accessToken: string | null, userData: UserProps | null }>}
 *          A promise that resolves with an object containing error, accessToken, and userData.
 */
export async function usePaypal(
  props: PaypalProps
): Promise<ResponseProps> {
  const {
    clientId,
    clientSecret,
    scope = [],
    emailRequired,
    sandbox = false,
    authorizationURL = "https://www.paypal.com/signin/authorize",
    tokenURL = "https://api-m.paypal.com/v1/oauth2/token",
    userURL = "https://api-m.paypal.com/v1/identity/openidconnect/userinfo",
    authorizationParams = {},
    redirectUri = window.location.origin,
  } = props;

  if (!clientId) {
    throw new Error("Client Id is Required");
  }

  const authURL = sandbox
    ? "https://www.sandbox.paypal.com/signin/authorize"
    : authorizationURL;
  const tokenUrl = sandbox
    ? "https://api-m.sandbox.paypal.com/v1/oauth2/token"
    : tokenURL;
  const userUrl = sandbox
    ? "https://api-m.sandbox.paypal.com/v1/identity/openidconnect/userinfo"
    : userURL;

  const initScope = !scope.includes("openid") ? [...scope, "openid"] : scope;
  const finalScope =
    emailRequired && !scope.includes("email") ? [...scope, "email"] : scope;

  const authParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: finalScope.join(" "),
    flowEntry: "static",
    ...authorizationParams,
  });

  const popup = new PopupWindow({
    url: `${authURL}?${authParams.toString()}`,
    windowName: "Paypal Login",
    redirectUri: redirectUri ?? window.location.origin,
  });

  try {
    const params = await popup.open();
    if (params.error) {
      throw new Error(params.error);
    }

    const authCode = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authCode}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&code=${params.code}&redirect_uri=${redirectUri}`,
    });

    const tokenData = await response.json();

    if (tokenData.error) {
      throw new Error(
        tokenData.error?.data?.error_description ||
          "Error retrieving access token"
      );
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch(`${userUrl}?schema=openid`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();
    return { error: null, accessToken, userData };
  } catch (error) {
    return { error, accessToken: null, userData: null };
  }
}

export const PaypalLogin: React.FC<LoginButtonProps<PaypalProps>> = ({
  onFailure,
  onSuccess,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await usePaypal(props);
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
      {loading ? "Loading..." : "Login with Paypal"}
    </TextButton>
  );
};

export const PaypalIconButton: React.FC<IconButtonProps<PaypalProps>> = ({
  onFailure,
  onSuccess,
  icon = PaypalIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await usePaypal(props);
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
      aria-label="Login with Paypal"
    >
      {loading ? "Logging..." : "Login with Paypal"}
    </IconButton>
  );
};
