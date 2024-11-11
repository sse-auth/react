import { Profile, TokenEndpointResponse } from "../types";

export * from "./auth0";
export * from "./battlenet";
export * from "./cognito";
export * from "./discord";
export * from "./github";
export * from "./google";
export * from "./keycloak";
export * from "./linkedin";
export * from "./microsoft";
export * from "./paypal";
export * from "./spotify";
export * from "./steam";
export * from "./twitch";
export * from "./x";
export * from "./xsuaa";
export * from "./yandex";

type UxMode = "popup" | "redirect";

export interface SSEProps {
  /**
   * @default 'popup'
   */
  ux_mode?: UxMode;
  /**
   * @default window.location.orign
   */
  redirectUri?: string;
}

export interface UserProps {
  [key: string]: any;
}

export type TokenSet = Partial<TokenEndpointResponse> & {
  /**
   * Date of when the `access_token` expires in seconds.
   * This value is calculated from the `expires_in` value.
   *
   * @see https://www.ietf.org/rfc/rfc6749.html#section-4.2.2
   */
  expires_at?: number;
};

export type ResponseProps<T extends UserProps = UserProps> = {
  error: Error | null | unknown;
  accessToken: TokenSet | null;
  userData: T | null;
  profile?: Profile;
};

export type LoginButtonProps<T, U extends UserProps = UserProps> = T & {
  onSuccess: (accessToken: TokenSet, userData: U, profile?: Profile) => void;
  onFailure: (error: Error) => void;
};

export type IconButtonProps<T, U extends UserProps = UserProps> = T & {
  onSuccess: (accessToken: TokenSet, userData: U, profile?: Profile) => void;
  onFailure: (error: Error) => void;
  icon?: React.ReactNode | string;
  variant?: string;
  className?: string;
};

export interface SSEGlobalProps {
  clientId?: string;
  clientSecret?: string;
}
