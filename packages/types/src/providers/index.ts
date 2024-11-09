import { Profile } from "../types";

export * from "./Auth0";
export * from "./BattleDotNet";
export * from "./Cognito";
export * from "./Discord";
export * from "./Github";
export * from "./Google";
export * from "./Keycloak";
export * from "./Linkedin";
export * from "./Microsoft";
export * from "./Paypal";
export * from "./Spotify";
export * from "./Steam";
export * from "./Twitch";
export * from "./X";
export * from "./Xsuaa";
export * from "./Yandex";

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

export interface ResponseObjProps<T extends UserProps = UserProps> {
  error: Error | null | unknown;
  accessToken: string | null | object;
  userData: T | null;
}

export type ResponseProps<T extends UserProps = UserProps> = {
  error: Error | null | unknown;
  accessToken: string | null;
  userData: T | null;
  profile?: Profile;
};

export type LoginButtonProps<T, U extends UserProps = UserProps> = T & {
  onSuccess: (accessToken: string, userData: U, profile?: Profile) => void;
  onFailure: (error: Error) => void;
};

export type IconButtonProps<T, U  extends UserProps = UserProps> = T & {
  onSuccess: (accessToken: string, userData: U, profile?: Profile) => void;
  onFailure: (error: Error) => void;
  icon?: React.ReactNode | string;
  variant?: string;
  className?: string;
};

export interface SSEGlobalProps {
  clientId?: string;
  clientSecret?: string;
}
