import { SSE_Profile } from "../index";
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
  TokenSet,
  TwitchProps,
  UserProps,
  XProps,
  XSUAAProps,
  YandexProps,
} from "../providers";
import { PageOptions } from "./font";

export type AuthProviderContext =
  | { name: "auth0"; options: Auth0Props }
  | { name: "battleDotNet"; options: BattledotnetProps }
  | { name: "cognito"; options: CognitoProps }
  | { name: "discord"; options: DiscordProps }
  | { name: "github"; options: GithubProps }
  | { name: "google"; options: GoogleProps }
  | { name: "keycloak"; options: KeycloakProps }
  | { name: "linkedIn"; options: LinkedInProps }
  | { name: "microsoft"; options: MicrosoftProps }
  | { name: "paypal"; options: PaypalProps }
  | { name: "spotify"; options: SpotifyProps }
  | { name: "steam"; options: SteamProps }
  | { name: "twitch"; options: TwitchProps }
  | { name: "x"; options: XProps }
  | { name: "xsuaa"; options: XSUAAProps }
  | { name: "yandex"; options: YandexProps };

export type ProviderContextMap = {
  auth0?: Auth0Props;
  battleDotNet?: BattledotnetProps;
  cognito?: CognitoProps;
  discord?: DiscordProps;
  github?: GithubProps;
  google?: GoogleProps;
  keycloak?: KeycloakProps;
  linkedIn?: LinkedInProps;
  microsoft?: MicrosoftProps;
  paypal?: PaypalProps;
  spotify?: SpotifyProps;
  steam?: SteamProps;
  twitch?: TwitchProps;
  x?: XProps;
  xsuaa?: XSUAAProps;
  yandex?: YandexProps;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (providerName: keyof ProviderContextMap) => void;
  signOut: () => void;
  error: Error | string | null | unknown;
  providers: ProviderContextMap | null;
  data: {
    user: UserProps | null;
    accessToken: TokenSet | null;
    profile: SSE_Profile | null;
  };
  options?: PageOptions;
};

interface AuthConfig {
  /**
   * A random string used to hash tokens, sign cookies and generate cryptographic keys.
   *
   * To generate a random string, you can use the Auth.js CLI: `npx auth secret`
   *
   * @note
   * You can also pass an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * The newer secret should be added to the start of the array, which will be used for all new sessions.
   *
   */
  secret?: string | string[];
  /**
   * Specify URLs to be used if you want to create custom sign in, sign out and error pages.
   * Pages specified will override the corresponding built-in page.
   *
   * @default {}
   * @example
   *
   * ```ts
   *   pages: {
   *     signIn: '/auth/signin',
   *     signOut: '/auth/signout',
   *     error: '/auth/error',
   *     verifyRequest: '/auth/verify-request',
   *     newUser: '/auth/new-user'
   *   }
   * ```
   */
  pages?: Partial<{
    /**
     * The path to the sign in page.
     *
     * The optional "error" query parameter is set to
     * one of the {@link SignInPageErrorParam available} values.
     *
     * @default "/signin"
     */
    signIn?: string;
    signOut?: string;
    /**
     * The path to the error page.
     *
     * The optional "error" query parameter is set to
     * one of the {@link ErrorPageParam available} values.
     *
     * @default "/error"
     */
    error?: string;
    verifyRequest?: string;
    /** If set, new users will be directed here on first sign in */
    newUser?: string;
  }>;
  /**
   * Relative time from now in seconds when to expire the session
   *
   * @default 2592000 // 30 days
   */
  maxAge?: number;
  /**
   * When set to `true` then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.
   * This option defaults to `false` on URLs that start with `http://` (e.g. http://localhost:3000) for developer convenience.
   * You can manually set this option to `false` to disable this security feature and allow cookies
   * to be accessible from non-secured URLs (this is not recommended).
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * The default is `false` HTTP and `true` for HTTPS sites.
   */
  useSecureCookies?: boolean;
  /** Changes the theme of built-in {@link AuthConfig.pages}. */
  theme?: {
    colorScheme?: "auto" | "dark" | "light";
    logo?: string;
    brandColor?: string;
    buttonText?: string;
  };
}
