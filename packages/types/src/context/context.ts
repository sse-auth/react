import {
  Auth0Props,
  BattledotnetProps,
  CognitoProps,
  DiscordProps,
  GithubProps,
  GoogleProps,
  KeycloakProps,
  LinkedInProps,
  MicrosoftProps,
  PaypalProps,
  SpotifyProps,
  SteamProps,
  TwitchProps,
  UserProps,
  XProps,
  XSUAAProps,
  YandexProps,
} from "../providers";
import { PageOptions } from "./font";

export type AuthProviderContext =
  | { name: "Auth0"; options: Auth0Props }
  | { name: "BattleDotNet"; options: BattledotnetProps }
  | { name: "Cognito"; options: CognitoProps }
  | { name: "Discord"; options: DiscordProps }
  | { name: "Github"; options: GithubProps }
  | { name: "Google"; options: GoogleProps }
  | { name: "Keycloak"; options: KeycloakProps }
  | { name: "LinkedIn"; options: LinkedInProps }
  | { name: "Microsoft"; options: MicrosoftProps }
  | { name: "Paypal"; options: PaypalProps }
  | { name: "Spotify"; options: SpotifyProps }
  | { name: "Steam"; options: SteamProps }
  | { name: "Twitch"; options: TwitchProps }
  | { name: "X"; options: XProps }
  | { name: "Xsuaa"; options: XSUAAProps }
  | { name: "Yandex"; options: YandexProps };

export type ProviderContextMap = {
  Auth0?: Auth0Props;
  BattleDotNet?: BattledotnetProps;
  Cognito?: CognitoProps;
  Discord?: DiscordProps;
  Github?: GithubProps;
  Google?: GoogleProps;
  Keycloak?: KeycloakProps;
  LinkedIn?: LinkedInProps;
  Microsoft?: MicrosoftProps;
  Paypal?: PaypalProps;
  Spotify?: SpotifyProps;
  Steam?: SteamProps;
  Twitch?: TwitchProps;
  X?: XProps;
  Xsuaa?: XSUAAProps;
  Yandex?: YandexProps;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (
    providerName: keyof ProviderContextMap,
    options?: { redirectTo?: string }
  ) => void;
  signOut: () => void;
  error: Error | string | null | unknown;
  providers: ProviderContextMap | null;
  data: {
    user: UserProps | null;
    accessToken: string | null;
  };
  options?: PageOptions;
};
